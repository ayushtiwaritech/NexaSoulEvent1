/**
 * app/operatives/page.tsx
 *
 * Next.js page for the /operatives route.
 * Renders Pair B's Mission Operatives dashboard (src/App.tsx) inside Next.js.
 *
 * Must be a Client Component ('use client') because src/App.tsx uses:
 *   - useState / useEffect (React hooks)
 *   - localStorage (browser API — accessed only inside lazy useState initializers
 *     and useEffect, so SSR-safe)
 *   - Canvas API (inside useEffect in CursedBackground, SSR-safe)
 *   - requestAnimationFrame (inside useEffect, SSR-safe)
 *
 * All src/App.tsx imports (src/components/*) automatically become
 * Client Components when imported from a 'use client' boundary.
 *
 * CSS is handled by app/operatives/layout.tsx (Server Component) which imports:
 *   - app/operatives/operatives.css  (Pair B CSS variables)
 *   - src/App.css                    (Pair B component styles)
 */
import { getAcceptedMissionsAction } from '@/app/actions';
import OperativesClient from './OperativesClient';

export const dynamic = 'force-dynamic';

export default async function OperativesPage() {
  const serverMissions = await getAcceptedMissionsAction();

  return (
    <div className="operatives-page-wrapper">
      <OperativesClient initialServerMissions={serverMissions} />
    </div>
  );
}

