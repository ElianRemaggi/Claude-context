import { create } from 'zustand';
import { Project } from '@/lib/types';

interface SessionStore {
  projects: Project[];
  selectedProjectId: string | null;
  selectedSessionId: string | null;
  searchQuery: string;
  folderLoaded: boolean;

  setProjects: (projects: Project[]) => void;
  selectProject: (id: string | null) => void;
  selectSession: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFolderLoaded: (loaded: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  projects: [],
  selectedProjectId: null,
  selectedSessionId: null,
  searchQuery: '',
  folderLoaded: false,

  setProjects: (projects) =>
    set({
      projects,
      folderLoaded: true,
      selectedProjectId: projects.length > 0 ? projects[0].id : null,
      selectedSessionId: null,
    }),

  selectProject: (id) =>
    set({ selectedProjectId: id, selectedSessionId: null }),

  selectSession: (id) =>
    set({ selectedSessionId: id }),

  setSearchQuery: (query) =>
    set({ searchQuery: query }),

  setFolderLoaded: (loaded) =>
    set({ folderLoaded: loaded }),

  reset: () =>
    set({
      projects: [],
      selectedProjectId: null,
      selectedSessionId: null,
      searchQuery: '',
      folderLoaded: false,
    }),
}));
