import { useMemo } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useFilteredStats, useDateRange } from '@/shared/hooks';
import { formatNumber, msToMinutes } from '@/shared/utils';

export function YearInReviewCard() {
  const stats = useFilteredStats();
  const { startDate, endDate } = useDateRange();

  const summary = useMemo(() => {
    if (!stats) return null;

    const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
    const totalHours = Math.round(totalMinutes / 60);
    const topArtist = stats.topArtists[0];
    const topTrack = stats.topTracks[0];

    // Get year from date range
    const startYear = new Date(`${startDate}-01`).getFullYear();
    const endYear = new Date(`${endDate}-01`).getFullYear();
    const year = startYear === endYear ? startYear.toString() : `${startYear}-${endYear}`;

    return {
      year,
      totalHours,
      totalMinutes,
      totalTracks: stats.totalTracks,
      totalArtists: stats.totalArtists,
      topArtist: topArtist
        ? {
            name: topArtist.name,
            plays: topArtist.playCount,
            minutes: Math.round(msToMinutes(topArtist.totalMs)),
          }
        : null,
      topTrack: topTrack
        ? {
            name: topTrack.name,
            artist: topTrack.artist,
            plays: topTrack.playCount,
          }
        : null,
      avgDaily: Math.round(stats.averageListeningPerDay || 0),
    };
  }, [stats, startDate, endDate]);

  if (!stats || !summary) return null;

  const readouts = [
    { label: 'Hours Listened', value: formatNumber(summary.totalHours) },
    { label: 'Different Songs', value: formatNumber(summary.totalTracks) },
    { label: 'Artists Explored', value: formatNumber(summary.totalArtists) },
    { label: 'Min Per Day', value: String(summary.avgDaily) },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div id="year-in-review-card" className="relative bg-card p-6 sm:p-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <span className="code-strip" aria-hidden>
                <i className="bg-code-green" />
                <i className="bg-code-blue" />
                <i className="bg-code-yellow" />
                <i className="bg-code-orange" />
              </span>
              <div>
                <h2 className="text-7xl sm:text-8xl font-medium leading-none tracking-[-0.03em] tabular-nums">
                  {summary.year}
                </h2>
                <p className="text-2xl sm:text-3xl font-semibold uppercase tracking-[0.2em] text-primary mt-3">
                  Wrapped
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <dl className="grid grid-cols-2 gap-x-6 border-t border-border">
                {readouts.map((item) => (
                  <div key={item.label} className="flex flex-col py-3 border-b border-border">
                    <dt className="label-caps mt-1 order-2">{item.label}</dt>
                    <dd className="order-1 text-3xl lg:text-4xl font-medium tabular-nums">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {(summary.topArtist ?? summary.topTrack) && (
                <dl className="border-t border-foreground">
                  {summary.topArtist && (
                    <div className="grid grid-cols-[0.625rem_1fr] gap-x-3 py-3 border-b border-border">
                      <span className="h-2.5 w-2.5 bg-code-green mt-1.5" aria-hidden />
                      <div className="min-w-0">
                        <dt className="label-caps">Top Artist</dt>
                        <dd className="text-xl font-semibold truncate mt-1">
                          {summary.topArtist.name}
                        </dd>
                        <dd className="text-sm text-muted-foreground tabular-nums">
                          {formatNumber(summary.topArtist.plays)} plays ·{' '}
                          {formatNumber(summary.topArtist.minutes)} minutes
                        </dd>
                      </div>
                    </div>
                  )}
                  {summary.topTrack && (
                    <div className="grid grid-cols-[0.625rem_1fr] gap-x-3 py-3 border-b border-border">
                      <span className="h-2.5 w-2.5 bg-code-blue mt-1.5" aria-hidden />
                      <div className="min-w-0">
                        <dt className="label-caps">Top Track</dt>
                        <dd className="text-xl font-semibold truncate mt-1">
                          {summary.topTrack.name}
                        </dd>
                        <dd className="text-sm text-muted-foreground truncate">
                          {summary.topTrack.artist} ·{' '}
                          <span className="tabular-nums">
                            {formatNumber(summary.topTrack.plays)} plays
                          </span>
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
