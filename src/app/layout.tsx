import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import type { ReactNode } from 'react';
import { DEFAULT_THEME } from '@/domain/theme';
import { themeInitScript } from './themeScript';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teampad',
  description: 'Team task board',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // suppressHydrationWarning: themeInitScript may change data-* attributes before React hydrates.
    <html
      lang="en"
      data-mode={DEFAULT_THEME.mode}
      data-accent={DEFAULT_THEME.accent}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-canvas text-fg antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
