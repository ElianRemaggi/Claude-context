import { Session, ParsedMessage } from './types';

/**
 * Format a single message for clipboard output.
 */
function formatMessage(msg: ParsedMessage): string {
  const roleLabel = msg.role === 'human' ? 'Human' : 'Assistant';
  let output = `**${roleLabel}:**\n${msg.content}`;

  if (msg.toolUses.length > 0) {
    for (const tool of msg.toolUses) {
      output += `\n\n<tool_use: ${tool.name}>`;
      if (tool.input) {
        output += `\n${tool.input}`;
      }
      output += `\n</tool_use>`;
    }
  }

  return output;
}

/**
 * Format an entire session as markdown for pasting into Claude.
 */
export function formatSessionForClipboard(session: Session, projectName?: string): string {
  const header = [
    '# Conversación recuperada de Claude Code',
    projectName ? `## Proyecto: ${projectName}` : null,
    session.date ? `## Fecha: ${new Date(session.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}` : null,
    `## Mensajes: ${session.messageCount}`,
    '',
    '---',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  const body = session.messages.map(formatMessage).join('\n\n---\n\n');

  return `${header}${body}`;
}

/**
 * Format a session preview (first N chars of first human message).
 */
export function formatPreview(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format a date for display in the UI.
 */
export function formatDate(isoDate: string | null): string {
  if (!isoDate) return 'Fecha desconocida';

  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Fecha desconocida';
  }
}
