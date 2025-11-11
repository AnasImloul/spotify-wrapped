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
import { useSpotifyData } from '@/shared/hooks';
import type { ProcessedStats } from '@/shared/types/analytics';

export interface AnalyticsOutletContext {
  stats: ProcessedStats;
}

export default function AnalyticsPageLayout() {
  const navigate = useNavigate();
  const { stats } = useSpotifyData();

  return (
    <AnalyticsLayout>
      {/* Header */}
      <AnalyticsHeader
        hasData={!!stats}
        onShowStoryMode={() => navigate('/story')}
        renderShareMenu={() =>
          stats ? (
            <ShareExportMenu
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            />
          ) : null
        }
      />

      {/* Filter Toolbar */}
      {stats && (
        <>
          <FilterToolbar />

          {/* Page Content - Rendered by child routes */}
          <main className="flex-grow container mx-auto px-4 pb-12 pt-6 space-y-12">
            <Outlet context={{ stats } satisfies AnalyticsOutletContext} />
          </main>
        </>
      )}

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}
