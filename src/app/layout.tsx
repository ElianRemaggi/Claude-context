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
  return (
    <html lang="es">
      <body className="noise-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
