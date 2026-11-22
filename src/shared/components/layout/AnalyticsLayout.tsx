/**
 * Analytics Layout Component
 * Main layout wrapper for analytics pages
 */

import { ReactNode } from 'react';

interface AnalyticsLayoutProps {
  children: ReactNode;
}

export function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  return <div className="min-h-screen bg-background text-foreground flex flex-col">{children}</div>;
}
