import { useOutletContext } from 'react-router-dom';
import { StatsOverview, TopItems, QuickStatsCarousel } from '@/features/analytics';
import { BarChart3, Trophy } from 'lucide-react';
import { useFilterSettings } from '@/features/analytics/hooks';
import type { AnalyticsOutletContext } from './AnalyticsPageLayout';

export default function OverviewPage() {
  const { stats } = useOutletContext<AnalyticsOutletContext>();
  const { sortBy, setSortBy } = useFilterSettings();

  return (
    <>
      <div className="animate-fade-in">
        <QuickStatsCarousel />
      </div>

      <div>
        <div className="glass-card rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium text-white/80">Sort Rankings By:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('time')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === 'time'
                    ? 'bg-green-500/30 text-green-300 border border-green-500/40'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                Listening Time
              </button>
              <button
                onClick={() => setSortBy('plays')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === 'plays'
                    ? 'bg-green-500/30 text-green-300 border border-green-500/40'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                Number of Plays
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12 animate-fade-in">
        <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

        <div>
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-400" />
            Your Statistics
          </h3>
          <StatsOverview />
        </div>

        {(stats.topArtists.length > 0 || stats.topTracks.length > 0) && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-400" />
                Hall of Fame
              </h3>
              <TopItems />
            </div>
          </>
        )}
      </div>
    </>
  );
}
