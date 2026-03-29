import {
  RawMessage,
  ContentBlock,
  ParsedMessage,
  ToolUseEntry,
  Session,
  Project,
} from './types';

/**
 * Extract text content from a message's content field,
 * handling both string and ContentBlock[] formats.
 */
function extractTextContent(content: string | ContentBlock[] | undefined): string {
  if (!content) return '';
  if (typeof content === 'string') return content;

  return content
    .filter((block) => block.type === 'text' && block.text)
    .map((block) => block.text!)
    .join('\n');
}

/**
 * Normalize role strings: 'user' → 'human', etc.
 */
function normalizeRole(role: string): 'human' | 'assistant' | null {
  if (role === 'human' || role === 'user') return 'human';
  if (role === 'assistant') return 'assistant';
  return null;
}

/**
 * Extract tool_result content from ContentBlock arrays, keyed by tool_use_id.
 */
function extractToolResults(content: string | ContentBlock[] | undefined): Map<string, string> {
  const results = new Map<string, string>();
  if (!content || typeof content === 'string') return results;

  for (const block of content) {
    if (block.type === 'tool_result' && block.id) {
      let resultText = '';
      if (typeof block.content === 'string') {
        resultText = block.content;
      } else if (Array.isArray(block.content)) {
        resultText = block.content
          .filter((b) => b.type === 'text' && b.text)
          .map((b) => b.text!)
          .join('\n');
      }
      results.set(block.id, resultText);
    }
  }

  return results;
}

/**
 * Extract tool uses with their IDs for result matching.
 */
function extractToolUsesWithIds(content: string | ContentBlock[] | undefined): ToolUseEntry[] {
  if (!content || typeof content === 'string') return [];

  const toolUses: ToolUseEntry[] = [];

  for (const block of content) {
    if (block.type === 'tool_use') {
      toolUses.push({
        name: block.name || 'unknown_tool',
        input: block.input ? JSON.stringify(block.input, null, 2) : '',
        result: null,
        _id: block.id || null,
      });
    }
  }

  return toolUses;
}

interface ParsedLine {
  role: 'human' | 'assistant';
  content: string;
  toolUses: ToolUseEntry[];
  toolResults: Map<string, string>;
  timestamp: string | null;
}

/**
 * Parse a single JSONL line into a normalized message, or null if not relevant.
 */
function parseJsonlLine(line: string): ParsedLine | null {
  if (!line.trim()) return null;

  let raw: RawMessage;
  try {
    raw = JSON.parse(line);
  } catch {
    return null;
  }

  // Claude Code JSONL can have multiple shapes:
  // Shape 1: { type: "human"|"assistant", message: { role, content }, timestamp }
  // Shape 2: { role: "human"|"assistant"|"user", content: ..., timestamp }
  // Shape 3: { type: "human"|"assistant", content: ... }
  // Shape 4: { type: "result", ... } (we skip these)

  let role: 'human' | 'assistant' | null = null;
  let content: string | ContentBlock[] | undefined;
  let timestamp: string | null = null;

  if (raw.timestamp) {
    timestamp = raw.timestamp as string;
  }

  // Shape 1: nested message
  if (raw.message && raw.message.role) {
    role = normalizeRole(raw.message.role);
    content = raw.message.content;
  }
  // Shape 2: top-level role
  else if (raw.role) {
    role = normalizeRole(raw.role);
    content = raw.content;
  }
  // Shape 3: type field matches role
  else if (raw.type && (raw.type === 'human' || raw.type === 'assistant' || raw.type === 'user')) {
    role = normalizeRole(raw.type);
    content = raw.content;
  }

  if (!role) return null;

  const textContent = extractTextContent(content);
  const toolUses = extractToolUsesWithIds(content);
  const toolResults = extractToolResults(content);

  // Skip empty messages
  if (!textContent && toolUses.length === 0) return null;

  return { role, content: textContent, toolUses, toolResults, timestamp };
}

/**
 * Parse a full JSONL file string into a Session.
 */
export function parseSessionFile(fileName: string, fileContent: string): Session | null {
  const lines = fileContent.split('\n');
  const messages: ParsedMessage[] = [];
  let firstTimestamp: string | null = null;

  // First pass: collect all tool results keyed by ID
  const allToolResults = new Map<string, string>();
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const raw = JSON.parse(line);
      const content = raw?.message?.content ?? raw?.content;
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block.type === 'tool_result' && block.id) {
            let resultText = '';
            if (typeof block.content === 'string') {
              resultText = block.content;
            } else if (Array.isArray(block.content)) {
              resultText = block.content
                .filter((b: ContentBlock) => b.type === 'text' && b.text)
                .map((b: ContentBlock) => b.text!)
                .join('\n');
            }
            if (resultText) allToolResults.set(block.id, resultText);
          }
        }
      }
    } catch {
      // skip
    }
  }

  // Second pass: parse messages and attach tool results
  for (const line of lines) {
    const parsed = parseJsonlLine(line);
    if (!parsed) continue;

    if (!firstTimestamp && parsed.timestamp) {
      firstTimestamp = parsed.timestamp;
    }

    // Attach tool results from the global map
    for (const toolUse of parsed.toolUses) {
      if (toolUse._id && allToolResults.has(toolUse._id)) {
        toolUse.result = allToolResults.get(toolUse._id)!;
      }
    }

    messages.push({
      role: parsed.role,
      content: parsed.content,
      toolUses: parsed.toolUses,
      timestamp: parsed.timestamp,
    });
  }

  // Skip sessions with no meaningful messages
  if (messages.length === 0) return null;

  const firstHuman = messages.find((m) => m.role === 'human');
  const firstHumanMessage = firstHuman
    ? firstHuman.content.slice(0, 200)
    : '(sin mensaje inicial)';

  // Try to extract date from timestamp or filename
  let date: string | null = null;
  if (firstTimestamp) {
    try {
      const d = new Date(firstTimestamp);
      if (!isNaN(d.getTime())) {
        date = d.toISOString();
      }
    } catch {
      // ignore
    }
  }

  return {
    id: `${fileName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    fileName,
    messages,
    firstHumanMessage,
    messageCount: messages.length,
    date,
    rawText: fileContent,
  };
}

/**
 * Clean up a project folder name for display.
 * ".claude/projects/my-project-abc123" → "my-project"
 */
export function cleanProjectName(folderName: string): string {
  // Remove trailing hash (common in Claude Code project folders)
  // Pattern: name-hexhash where hash is typically 6-40 hex chars at the end
  const cleaned = folderName.replace(/-[a-f0-9]{6,}$/i, '');

  // Replace remaining separators with spaces and clean up
  return cleaned
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || folderName;
}

/**
 * Build a Project from a folder name and its parsed sessions.
 */
export function buildProject(folderName: string, sessions: Session[]): Project {
  // Sort sessions by date, newest first
  const sortedSessions = [...sessions].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return {
    id: folderName,
    folderName,
    displayName: cleanProjectName(folderName),
    sessions: sortedSessions,
    sessionCount: sortedSessions.length,
  };
}
