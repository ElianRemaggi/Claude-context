'use client';

import { useMemo, useState } from 'react';
import { Project, Session } from '@/lib/types';
import ProjectSidebar from './ProjectSidebar';
import SessionList from './SessionList';
import ConversationView from './ConversationView';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';

interface DashboardProps {
  projects: Project[];
  selectedProjectId: string | null;
  selectedSessionId: string | null;
  searchQuery: string;
  onSelectProject: (id: string) => void;
  onSelectSession: (id: string | null) => void;
  onSearchChange: (query: string) => void;
  onReloadFolder: () => void;
}

type MobileView = 'projects' | 'sessions' | 'conversation';

export default function Dashboard({
  projects,
  selectedProjectId,
  selectedSessionId,
  searchQuery,
  onSelectProject,
  onSelectSession,
  onSearchChange,
  onReloadFolder,
}: DashboardProps) {
  const [mobileView, setMobileView] = useState<MobileView>('projects');

  // Get selected project
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    if (!selectedProject) return [];
    if (!searchQuery.trim()) return selectedProject.sessions;

    const q = searchQuery.toLowerCase();
    return selectedProject.sessions.filter((session) =>
      session.messages.some(
        (msg) =>
          msg.content.toLowerCase().includes(q) ||
          msg.toolUses.some((t) => t.name.toLowerCase().includes(q))
      )
    );
  }, [selectedProject, searchQuery]);

  // Get selected session
  const selectedSession = useMemo(() => {
    if (!selectedSessionId || !selectedProject) return null;
    return selectedProject.sessions.find((s) => s.id === selectedSessionId) || null;
  }, [selectedProject, selectedSessionId]);

  // Count total sessions across all projects for search display
  const totalFilteredCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    const q = searchQuery.toLowerCase();
    let count = 0;
    for (const project of projects) {
      count += project.sessions.filter((session) =>
        session.messages.some((msg) => msg.content.toLowerCase().includes(q))
      ).length;
    }
    return count;
  }, [projects, searchQuery]);

  // Mobile navigation handlers
  const handleSelectProjectMobile = (id: string) => {
    onSelectProject(id);
    setMobileView('sessions');
  };

  const handleSelectSessionMobile = (id: string | null) => {
    onSelectSession(id);
    if (id) setMobileView('conversation');
  };

  const handleBackToProjects = () => {
    setMobileView('projects');
  };

  const handleBackToSessions = () => {
    onSelectSession(null);
    setMobileView('sessions');
  };

  const totalSessions = projects.reduce((acc, p) => acc + p.sessionCount, 0);

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-3 md:px-4 py-3 border-b border-clay-200 dark:border-ink-800 bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm flex-shrink-0">
        {/* Mobile back button */}
        {mobileView !== 'projects' && (
          <button
            onClick={mobileView === 'conversation' ? handleBackToSessions : handleBackToProjects}
            className="md:hidden p-1.5 -ml-1 rounded-md text-ink-500 hover:text-ink-800 dark:hover:text-ink-200 hover:bg-clay-100 dark:hover:bg-ink-800 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-clay-200 dark:bg-ink-800 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-clay-700 dark:text-clay-300">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="font-display text-base text-ink-900 dark:text-clay-100 hidden sm:block">Session Recovery</h1>
        </div>

        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            totalResults={searchQuery ? totalFilteredCount : 0}
          />
        </div>

        <div className="text-xs text-ink-300 dark:text-ink-500 hidden lg:block">
          {totalSessions} sesiones · {projects.length} proyectos
        </div>

        <ThemeToggle />
      </header>

      {/* ═══ DESKTOP LAYOUT (md+): 3 columns ═══ */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        {/* Sidebar */}
        <ProjectSidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={onSelectProject}
          onReloadFolder={onReloadFolder}
        />

        {/* Center panel: session list */}
        {selectedProject ? (
          <div className="w-80 flex-shrink-0 border-r border-clay-200 dark:border-ink-800 flex flex-col">
            <SessionList
              sessions={filteredSessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={onSelectSession}
              projectName={selectedProject.displayName}
            />
          </div>
        ) : (
          <div className="w-80 flex-shrink-0 border-r border-clay-200 dark:border-ink-800 flex items-center justify-center text-ink-400 dark:text-ink-500 text-sm">
            Seleccioná un proyecto
          </div>
        )}

        {/* Right panel: conversation or empty */}
        {selectedSession ? (
          <ConversationView
            session={selectedSession}
            projectName={selectedProject?.displayName || ''}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-clay-100 dark:bg-ink-800 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay-400 dark:text-ink-500">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <p className="text-ink-500 dark:text-ink-400 text-sm">Seleccioná una sesión para ver la conversación</p>
              <p className="text-ink-300 dark:text-ink-600 text-xs mt-1">Luego podés copiarla y pegarla en Claude</p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ MOBILE LAYOUT (<md): stacked views ═══ */}
      <div className="flex-1 md:hidden overflow-hidden">
        {mobileView === 'projects' && (
          <div className="h-full overflow-y-auto">
            <div className="p-4">
              <h2 className="font-display text-lg text-ink-900 dark:text-clay-100 mb-1">Proyectos</h2>
              <p className="text-xs text-ink-400 dark:text-ink-500 mb-4">{projects.length} proyecto{projects.length !== 1 ? 's' : ''} · {totalSessions} sesiones</p>
              <div className="space-y-1.5">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProjectMobile(project.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${
                      project.id === selectedProjectId
                        ? 'bg-white dark:bg-ink-800 border-clay-200 dark:border-ink-700 shadow-sm'
                        : 'bg-white/40 dark:bg-ink-800/30 border-transparent hover:bg-white dark:hover:bg-ink-800 hover:border-clay-200 dark:hover:border-ink-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${project.id === selectedProjectId ? 'bg-amber-500' : 'bg-clay-300 dark:bg-ink-600'}`} />
                        <p className="text-sm font-medium text-ink-800 dark:text-ink-200 truncate capitalize">{project.displayName}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-ink-400 dark:text-ink-500">{project.sessionCount}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-300 dark:text-ink-600">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={onReloadFolder}
                className="mt-6 w-full py-2.5 text-sm text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-300 border border-dashed border-clay-300 dark:border-ink-700 rounded-xl hover:border-clay-400 dark:hover:border-ink-500 transition-all"
              >
                Cambiar carpeta
              </button>
            </div>
          </div>
        )}

        {mobileView === 'sessions' && selectedProject && (
          <div className="h-full flex flex-col">
            <SessionList
              sessions={filteredSessions}
              selectedSessionId={selectedSessionId}
              onSelectSession={handleSelectSessionMobile}
              projectName={selectedProject.displayName}
            />
          </div>
        )}

        {mobileView === 'conversation' && selectedSession && (
          <ConversationView
            session={selectedSession}
            projectName={selectedProject?.displayName || ''}
          />
        )}
      </div>
    </div>
  );
}
