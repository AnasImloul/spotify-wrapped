/**
 * Analytics Layout Component
 * Main layout wrapper for analytics pages
 */

import { ReactNode } from 'react';

interface AnalyticsLayoutProps {
  children: ReactNode;
}

export function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 flex flex-col">
      {children}
    </div>
  );
}


