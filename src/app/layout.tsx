import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Claude Session Recovery',
  description: 'Recuperá y continuá tus conversaciones de Claude Code',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Inline script to set dark class before paint (prevents flash)
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      } catch(e) {}
    })();
  `;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="noise-bg min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
