'use client';

interface FolderPickerProps {
  onLoadFolder: () => void;
  isLoading: boolean;
  isSupported: boolean;
}

export default function FolderPicker({ onLoadFolder, isLoading, isSupported }: FolderPickerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo / Title */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-clay-200 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-clay-700">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01" />
              <path d="M12 10h.01" />
              <path d="M16 10h.01" />
            </svg>
          </div>
          <h1 className="font-display text-4xl text-ink-950 mb-3">
            Session Recovery
          </h1>
          <p className="text-ink-500 text-lg leading-relaxed max-w-md mx-auto">
            Recuperá tus conversaciones de Claude Code y continualas donde las dejaste.
          </p>
        </div>

        {/* Main action */}
        <div className="animate-slide-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          {isSupported ? (
            <button
              onClick={onLoadFolder}
              disabled={isLoading}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-ink-950 text-clay-50 rounded-xl font-medium text-base transition-all duration-200 hover:bg-ink-800 hover:shadow-lg hover:shadow-ink-950/10 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" strokeLinecap="round" />
                  </svg>
                  Leyendo archivos…
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  Seleccionar carpeta .claude/projects
                </>
              )}
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-left">
              <p className="text-amber-800 font-medium mb-1">Navegador no compatible</p>
              <p className="text-amber-700 text-sm">
                La File System Access API solo está disponible en Chrome, Edge y Brave.
                Abrí esta página en uno de esos navegadores para continuar.
              </p>
            </div>
          )}
        </div>

        {/* Privacy note */}
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
          <div className="inline-flex items-center gap-2 text-ink-400 text-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Tus datos nunca salen de tu navegador
          </div>
        </div>

        {/* Path hint */}
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
          <p className="text-ink-300 text-xs font-mono">
            Ruta típica: C:\Users\tu-usuario\.claude\projects
          </p>
        </div>
      </div>
    </div>
  );
}
