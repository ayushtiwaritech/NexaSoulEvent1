/**
 * app/operatives/layout.tsx
 *
 * Layout for the /operatives route.
 * - Imports Pair B's scoped CSS variables (operatives.css)
 * - Imports Pair B's main stylesheet (src/App.css — class-selectors only, no body overrides)
 * - Hides Pair A's Navbar on this route (Pair B renders its own Header)
 * - Server Component — safe to import global CSS here
 */
import type { ReactNode } from 'react';
import './operatives.css';
import '../../src/App.css';

export const metadata = {
  title: 'Mission Operatives — CU Mission Board',
  description: 'Active mission tracking, XP progression, proof submission, achievements and leaderboard for CU campus operatives.',
};

export default function OperativesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/*
        Hide Pair A's global Navbar on this route.
        Pair B's src/App.tsx renders its own <Header /> component.
        We use a style tag here since Next.js doesn't support conditional
        layout nesting at the route level without a separate root layout.
      */}
      <style>{`
        /* Suppress the global Navbar rendered by app/layout.tsx on the /operatives route */
        nav {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  );
}
