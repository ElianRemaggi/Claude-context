'use client';

import { Session } from '@/lib/types';
import { formatDate, formatPreview } from '@/lib/formatter';

interface SessionListProps {
  sessions: Session[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
  projectName: string;
}

export default function SessionList({
  sessions,
  selectedSessionId,
  onSelectSession,
  projectName,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-400 dark:text-ink-500 text-sm">
        No se encontraron sesiones
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-display text-xl text-ink-900 dark:text-clay-100 mb-1 capitalize">{projectName}</h3>
        <p className="text-xs text-ink-400 dark:text-ink-500 mb-4">
          {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''} encontrada{sessions.length !== 1 ? 's' : ''}
        </p>

        <div className="space-y-2">
          {sessions.map((session, i) => {
            const isSelected = session.id === selectedSessionId;
            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`
                  w-full text-left p-4 rounded-xl transition-all duration-150 group
                  animate-slide-up opacity-0
                  ${isSelected
                    ? 'bg-white dark:bg-ink-800 shadow-md border border-clay-200 dark:border-ink-600 ring-1 ring-amber-400/30'
                    : 'bg-white/50 dark:bg-ink-800/30 border border-transparent hover:bg-white dark:hover:bg-ink-800 hover:border-clay-200 dark:hover:border-ink-700 hover:shadow-sm'
                  }
                `}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Top row: date + message count */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-ink-400 dark:text-ink-500'}`}>
                    {formatDate(session.date)}
                  </span>
                  <span className="text-xs text-ink-300 dark:text-ink-500 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {session.messageCount}
                  </span>
                </div>

                {/* Preview */}
                <p className="text-sm text-ink-700 dark:text-ink-300 leading-relaxed line-clamp-2">
                  {formatPreview(session.firstHumanMessage)}
                </p>

                {/* File name */}
                <p className="text-[10px] font-mono text-ink-300 dark:text-ink-600 mt-2 truncate">
                  {session.fileName}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
