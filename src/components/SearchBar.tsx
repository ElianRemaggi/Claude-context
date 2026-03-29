'use client';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  totalResults: number;
}

export default function SearchBar({ value, onChange, totalResults }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar en conversaciones…"
        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-ink-800 border border-clay-200 dark:border-ink-700 rounded-lg text-sm text-ink-800 dark:text-ink-100 placeholder:text-ink-300 dark:placeholder:text-ink-500 focus:outline-none focus:border-clay-400 dark:focus:border-ink-500 focus:ring-2 focus:ring-clay-200/50 dark:focus:ring-ink-700/50 transition-all"
      />
      {value && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span className="text-xs text-ink-400">{totalResults}</span>
          <button
            onClick={() => onChange('')}
            className="text-ink-300 hover:text-ink-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
