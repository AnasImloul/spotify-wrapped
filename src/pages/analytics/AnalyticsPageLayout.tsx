/**
 * Analytics Page Layout
 * Shared layout for all analytics pages (Overview, Insights, Deep Dive)
 * Uses React Router Outlet to render child routes
 */

import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import {
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsFooter,
  FilterToolbar,
} from '@/shared/components/layout';
import { ShareExportMenu } from '@/features/sharing';
import { useMemo } from 'react';
import { useSpotifyData, useStatsPending } from '@/shared/hooks';
import type { ProcessedStats } from '@/shared/types/analytics';

export interface AnalyticsOutletContext {
  stats: ProcessedStats;
}

export default function AnalyticsPageLayout() {
  const navigate = useNavigate();
  const { stats } = useSpotifyData();
  const isStatsPending = useStatsPending();
  const outletContext = useMemo(() => ({ stats }) as AnalyticsOutletContext, [stats]);

  return (
    <AnalyticsLayout>
      {/* Header */}
      <AnalyticsHeader
        hasData={!!stats}
        onShowStoryMode={() => navigate('/story')}
        renderShareMenu={() => (stats ? <ShareExportMenu variant="ghost" size="sm" /> : null)}
      />

      {/* Filter Toolbar */}
      {stats && (
        <>
          <FilterToolbar />

          {/* Page Content - Rendered by child routes */}
          <main
            aria-busy={isStatsPending}
            className={`flex-grow container mx-auto px-4 pb-12 pt-6 lg:pt-8 space-y-12 transition-opacity duration-150 ${
              isStatsPending ? 'opacity-50' : ''
            }`}
          >
            <Outlet context={outletContext} />
          </main>
        </>
      )}

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}
