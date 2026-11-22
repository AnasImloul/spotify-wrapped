import { useOutletContext } from 'react-router-dom';
import { StatsOverview, TopItems, ListeningPulse } from '@/features/analytics';
import { useFilterSettings } from '@/features/analytics/hooks';
import type { AnalyticsOutletContext } from './AnalyticsPageLayout';

export default function OverviewPage() {
  const { stats } = useOutletContext<AnalyticsOutletContext>();
  const { sortBy, setSortBy } = useFilterSettings();

  const sortOption = (value: 'time' | 'plays', label: string) => (
    <button
      onClick={() => setSortBy(value)}
      aria-pressed={sortBy === value}
      className={`h-8 px-3 text-sm font-medium transition-colors border-r border-input last:border-r-0 ${
        sortBy === value
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <section className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <h2 className="sr-only">Overview</h2>
        <div className="lg:col-span-7 xl:col-span-8">
          <ListeningPulse />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <StatsOverview />
        </div>
      </section>

      {(stats.topArtists.length > 0 || stats.topTracks.length > 0) && (
        <section className="space-y-5 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-border pb-4">
            <h3 className="text-2xl lg:text-3xl font-semibold tracking-[-0.01em]">Hall of Fame</h3>
            <div className="flex items-center gap-3">
              <span className="label-caps">Sort by</span>
              <div role="group" aria-label="Sort by" className="flex border border-input">
                {sortOption('time', 'Time')}
                {sortOption('plays', 'Plays')}
              </div>
            </div>
          </div>
          <TopItems />
        </section>
      )}
    </>
  );
}
