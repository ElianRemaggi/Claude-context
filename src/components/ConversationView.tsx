'use client';

import { useState } from 'react';
import { Session } from '@/lib/types';
import { formatSessionForClipboard } from '@/lib/formatter';
import CopyButton from './CopyButton';

interface ConversationViewProps {
  session: Session;
  projectName: string;
}

export default function ConversationView({ session, projectName }: ConversationViewProps) {
  const [showToolUses, setShowToolUses] = useState<Record<number, boolean>>({});

  const toggleTool = (index: number) => {
    setShowToolUses((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const clipboardText = formatSessionForClipboard(session, projectName);

  return (
    <div className="flex-1 flex flex-col h-full bg-clay-50/30 dark:bg-ink-950/30">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-clay-200 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 backdrop-blur-sm">
        <div>
          <p className="text-sm font-medium text-ink-800 dark:text-ink-200">{session.fileName}</p>
          <p className="text-xs text-ink-400 dark:text-ink-500">{session.messageCount} mensajes</p>
        </div>
        <CopyButton text={clipboardText} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {session.messages.map((msg, i) => (
            <div
              key={i}
              className={`animate-fade-in opacity-0 rounded-xl p-4 ${
                msg.role === 'human'
                  ? 'bg-white dark:bg-ink-800 border border-clay-200 dark:border-ink-700 shadow-sm'
                  : 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30'
              }`}
              style={{ animationDelay: `${Math.min(i * 0.03, 0.5)}s` }}
            >
              {/* Role badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    msg.role === 'human'
                      ? 'bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300'
                      : 'bg-amber-200/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {msg.role === 'human' ? 'Tú' : 'Claude'}
                </span>
              </div>

              {/* Content */}
              <div className="message-content text-sm text-ink-800 dark:text-ink-200 leading-relaxed whitespace-pre-wrap break-words">
                {msg.content}
              </div>

              {/* Tool uses */}
              {msg.toolUses.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleTool(i)}
                    className="inline-flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${showToolUses[i] ? 'rotate-90' : ''}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {msg.toolUses.length} herramienta{msg.toolUses.length !== 1 ? 's' : ''}
                  </button>

                  {showToolUses[i] && (
                    <div className="mt-2 space-y-2">
                      {msg.toolUses.map((tool, ti) => (
                        <div
                          key={ti}
                          className="bg-ink-950 text-ink-200 rounded-lg p-3 text-xs font-mono overflow-x-auto"
                        >
                          <p className="text-amber-400 font-semibold mb-1">{tool.name}</p>
                          {tool.input && (
                            <pre className="whitespace-pre-wrap text-[11px] mb-2">{tool.input}</pre>
                          )}
                          {tool.result && (
                            <div className="border-t border-ink-800 pt-2 mt-2">
                              <p className="text-emerald-400 text-[10px] font-semibold mb-1 uppercase tracking-wider">Resultado</p>
                              <pre className="whitespace-pre-wrap text-[11px] text-ink-300 max-h-40 overflow-y-auto">{tool.result.length > 2000 ? tool.result.slice(0, 2000) + '\n…(truncado)' : tool.result}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
