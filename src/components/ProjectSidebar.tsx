'use client';

import { Project } from '@/lib/types';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onReloadFolder: () => void;
}

export default function ProjectSidebar({
  projects,
  selectedProjectId,
  onSelectProject,
  onReloadFolder,
}: ProjectSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-clay-200 dark:border-ink-800 bg-clay-50/50 dark:bg-ink-950/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-clay-200 dark:border-ink-800">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg text-ink-900 dark:text-clay-100">Proyectos</h2>
          <button
            onClick={onReloadFolder}
            title="Cambiar carpeta"
            className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-clay-200 dark:hover:bg-ink-800 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-ink-400 dark:text-ink-500">{projects.length} proyecto{projects.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Project list */}
      <nav className="flex-1 overflow-y-auto p-2">
        {projects.map((project, i) => {
          const isSelected = project.id === selectedProjectId;
          return (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`
                w-full text-left px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 group
                animate-slide-right opacity-0
                ${isSelected
                  ? 'bg-white dark:bg-ink-800 shadow-sm border border-clay-200 dark:border-ink-700 text-ink-900 dark:text-clay-100'
                  : 'text-ink-600 dark:text-ink-400 hover:bg-white/60 dark:hover:bg-ink-800/60 hover:text-ink-800 dark:hover:text-ink-200'
                }
              `}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${isSelected ? 'bg-amber-500' : 'bg-clay-300 dark:bg-ink-600 group-hover:bg-clay-400 dark:group-hover:bg-ink-500'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate capitalize">
                    {project.displayName}
                  </p>
                  <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
                    {project.sessionCount} sesión{project.sessionCount !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
