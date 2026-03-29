// ─── Raw JSONL message shapes from Claude Code ───

export interface RawMessage {
  type: string;
  role?: 'human' | 'assistant' | 'system';
  content?: string | ContentBlock[];
  timestamp?: string;
  message?: {
    role: 'human' | 'assistant' | 'system';
    content: string | ContentBlock[];
  };
  // Some JSONL entries have different structures
  [key: string]: unknown;
}

export interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result' | 'image';
  text?: string;
  name?: string;
  input?: Record<string, unknown>;
  content?: string | ContentBlock[];
  id?: string;
}

// ─── Parsed & normalized structures ───

export interface ParsedMessage {
  role: 'human' | 'assistant';
  content: string;
  toolUses: ToolUseEntry[];
  timestamp: string | null;
}

export interface ToolUseEntry {
  name: string;
  input: string;
  result: string | null;
  _id?: string | null;
}

export interface Session {
  id: string;
  sessionId: string;
  fileName: string;
  messages: ParsedMessage[];
  firstHumanMessage: string;
  messageCount: number;
  date: string | null;
  rawText: string;
}

export interface Project {
  id: string;
  folderName: string;
  displayName: string;
  sessions: Session[];
  sessionCount: number;
}

// ─── App state ───

export interface AppState {
  projects: Project[];
  selectedProjectId: string | null;
  selectedSessionId: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  folderLoaded: boolean;
}

// ─── File System Access API types ───

export interface FileSystemDirectoryHandleExtended extends FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<FileSystemHandle>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}
