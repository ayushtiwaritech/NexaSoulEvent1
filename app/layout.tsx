import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CU Mission Board',
  description: 'Campus Quests - Discover the campus, accept missions, level up.',
};

import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
