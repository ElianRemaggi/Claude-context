'use client';

import { useState, useCallback } from 'react';
import { parseSessionFile, buildProject } from '@/lib/parser';
import { Project, Session } from '@/lib/types';

interface UseFileSystemReturn {
  loadFolder: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  projects: Project[];
  isSupported: boolean;
}

/**
 * Check if File System Access API is supported.
 */
function checkSupport(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

/**
 * Recursively read all .jsonl files from a directory handle.
 */
async function readJsonlFiles(
  dirHandle: FileSystemDirectoryHandle,
  basePath: string = ''
): Promise<Map<string, { fileName: string; content: string }[]>> {
  const projectFiles = new Map<string, { fileName: string; content: string }[]>();

  try {
    for await (const [name, handle] of (dirHandle as any).entries()) {
      if (handle.kind === 'directory') {
        // This is a project folder
        const projectName = basePath ? `${basePath}/${name}` : name;
        const subDir = handle as FileSystemDirectoryHandle;
        const files: { fileName: string; content: string }[] = [];

        try {
          for await (const [subName, subHandle] of (subDir as any).entries()) {
            if (subHandle.kind === 'file' && subName.endsWith('.jsonl')) {
              try {
                const file = await (subHandle as FileSystemFileHandle).getFile();
                const content = await file.text();
                files.push({ fileName: subName, content });
              } catch (err) {
                console.warn(`Could not read file ${subName}:`, err);
              }
            }
          }
        } catch (err) {
          console.warn(`Could not read directory ${name}:`, err);
        }

        if (files.length > 0) {
          projectFiles.set(projectName, files);
        }
      } else if (handle.kind === 'file' && name.endsWith('.jsonl')) {
        // JSONL files at root level (unlikely but handle it)
        const rootKey = '__root__';
        const existing = projectFiles.get(rootKey) || [];
        try {
          const file = await (handle as FileSystemFileHandle).getFile();
          const content = await file.text();
          existing.push({ fileName: name, content });
          projectFiles.set(rootKey, existing);
        } catch (err) {
          console.warn(`Could not read root file ${name}:`, err);
        }
      }
    }
  } catch (err) {
    console.error('Error iterating directory:', err);
    throw new Error('No se pudo leer la carpeta seleccionada.');
  }

  return projectFiles;
}

export function useFileSystem(): UseFileSystemReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const isSupported = typeof window !== 'undefined' ? checkSupport() : true;

  const loadFolder = useCallback(async () => {
    if (!checkSupport()) {
      setError('Tu navegador no soporta File System Access API. Usá Chrome, Edge o Brave.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dirHandle = await (window as any).showDirectoryPicker({
        mode: 'read',
      });

      const projectFilesMap = await readJsonlFiles(dirHandle);

      if (projectFilesMap.size === 0) {
        setError('No se encontraron archivos .jsonl en la carpeta seleccionada. Asegurate de seleccionar la carpeta .claude/projects.');
        setIsLoading(false);
        return;
      }

      const parsedProjects: Project[] = [];

      for (const [folderName, files] of Array.from(projectFilesMap.entries())) {
        const sessions: Session[] = [];

        for (const file of files) {
          const session = parseSessionFile(file.fileName, file.content);
          if (session) {
            sessions.push(session);
          }
        }

        if (sessions.length > 0) {
          parsedProjects.push(buildProject(folderName, sessions));
        }
      }

      // Sort projects alphabetically by display name
      parsedProjects.sort((a, b) => a.displayName.localeCompare(b.displayName));

      setProjects(parsedProjects);
    } catch (err: any) {
      // User cancelled the picker
      if (err?.name === 'AbortError') {
        setIsLoading(false);
        return;
      }
      console.error('Error loading folder:', err);
      setError(err?.message || 'Error al leer la carpeta.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { loadFolder, isLoading, error, projects, isSupported };
}
