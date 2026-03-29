'use client';

import { useCallback } from 'react';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useSessionStore } from '@/store/sessions';
import FolderPicker from '@/components/FolderPicker';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { loadFolder, isLoading, error, projects: loadedProjects, isSupported } = useFileSystem();
  const store = useSessionStore();

  const handleLoadFolder = useCallback(async () => {
    await loadFolder();
  }, [loadFolder]);

  // Sync loaded projects to store (after loadFolder completes)
  // We use loadedProjects from the hook as the source of truth for initial load
  const hasProjects = store.folderLoaded && store.projects.length > 0;
  const displayProjects = hasProjects ? store.projects : loadedProjects;

  // When projects are loaded from file system, push to store
  if (loadedProjects.length > 0 && !store.folderLoaded) {
    store.setProjects(loadedProjects);
  }

  const handleReload = useCallback(() => {
    store.reset();
    handleLoadFolder();
  }, [store, handleLoadFolder]);

  // Show landing if no projects loaded
  if (!store.folderLoaded) {
    return (
      <div>
        <FolderPicker
          onLoadFolder={handleLoadFolder}
          isLoading={isLoading}
          isSupported={isSupported}
        />
        {error && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md w-full px-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 shadow-lg animate-slide-up">
              {error}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show dashboard
  return (
    <Dashboard
      projects={displayProjects}
      selectedProjectId={store.selectedProjectId}
      selectedSessionId={store.selectedSessionId}
      searchQuery={store.searchQuery}
      onSelectProject={store.selectProject}
      onSelectSession={store.selectSession}
      onSearchChange={store.setSearchQuery}
      onReloadFolder={handleReload}
    />
  );
}
