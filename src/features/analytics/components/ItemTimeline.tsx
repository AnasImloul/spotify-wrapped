import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_AXIS,
  CHART_COLORS,
  CHART_GRID,
  CHART_TOOLTIP,
  CHART_X_AXIS,
} from '@/shared/constants/charts';
import { useSpotifyData, useStatsRange } from '@/shared/hooks';

interface ItemTimelineProps {
  itemName: string;
  itemType: 'artist' | 'track';
  artistName?: string; // For tracks
  onClose: () => void;
}

export function ItemTimeline({ itemName, itemType, artistName, onClose }: ItemTimelineProps) {
  const { streamingHistory } = useSpotifyData();
  const { startDate, endDate } = useStatsRange();
  // Filter entries for this specific item
  const filteredEntries = streamingHistory.filter((entry) => {
    const entryDate = new Date(entry.endTime);
    const entryYearMonth = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;

    // Date range filter
    if (startDate && entryYearMonth < startDate) return false;
    if (endDate && entryYearMonth > endDate) return false;

    // Item filter
    if (itemType === 'artist') {
      return entry.artistName === itemName;
    } else {
      return entry.trackName === itemName && entry.artistName === artistName;
    }
  });

  // For artists, calculate top tracks
  const topTracks =
    itemType === 'artist'
      ? (() => {
          const trackMap = new Map<string, { plays: number; minutes: number }>();

          filteredEntries.forEach((entry) => {
            const existing = trackMap.get(entry.trackName) || { plays: 0, minutes: 0 };
            trackMap.set(entry.trackName, {
              plays: existing.plays + 1,
              minutes: existing.minutes + entry.msPlayed / 1000 / 60,
            });
          });

          return Array.from(trackMap.entries())
            .map(([track, stats]) => ({
              track,
              plays: stats.plays,
              minutes: Math.round(stats.minutes),
            }))
            .sort((a, b) => b.minutes - a.minutes)
            .slice(0, 5);
        })()
      : [];

  // Group by month
  const monthlyData = filteredEntries.reduce(
    (acc, entry) => {
      const date = new Date(entry.endTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          plays: 0,
          totalMinutes: 0,
        };
      }

      acc[monthKey].plays += 1;
      acc[monthKey].totalMinutes += entry.msPlayed / 1000 / 60;

      return acc;
    },
    {} as Record<string, { month: string; plays: number; totalMinutes: number }>
  );

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((item) => ({
      month: new Date(`${item.month}-01`).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      minutes: Math.round(item.totalMinutes),
      plays: item.plays,
    }));

  const totalPlays = filteredEntries.length;
  const totalMinutes = Math.round(
    filteredEntries.reduce((sum, e) => sum + e.msPlayed / 1000 / 60, 0)
  );

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-card">
      <Card
        role="dialog"
        aria-modal="true"
        className="w-full max-w-4xl h-full sm:h-[85vh] flex flex-col border-border bg-popover shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
      >
        <CardHeader className="border-b border-foreground flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl font-semibold mb-1">
                Listening Timeline
              </CardTitle>
              <div className="space-y-1">
                <p className="text-lg text-foreground font-semibold">{itemName}</p>
                {artistName && itemType === 'track' && (
                  <p className="text-sm text-muted-foreground">by {artistName}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-t border-border pt-3">
                <p className="label-caps mb-1">Total plays</p>
                <p className="text-3xl font-medium tabular-nums">{totalPlays.toLocaleString()}</p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="label-caps mb-1">Total minutes</p>
                <p className="text-3xl font-medium tabular-nums">{totalMinutes.toLocaleString()}</p>
              </div>
            </div>

            {/* Chart */}
            <div>
              <h3 className="label-caps mb-3">Listening Activity Over Time</h3>
              {chartData.length > 0 ? (
                <div className="border border-border p-3 sm:p-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData}>
                      <CartesianGrid {...CHART_GRID} />
                      <XAxis dataKey="month" {...CHART_X_AXIS} />
                      <YAxis
                        {...CHART_AXIS}
                        style={{ fontSize: '10px' }}
                        width={45}
                        label={{
                          value: 'Minutes',
                          angle: -90,
                          position: 'insideLeft',
                          fill: CHART_COLORS.textMuted,
                          style: { fontSize: '10px' },
                        }}
                      />
                      <Tooltip
                        {...CHART_TOOLTIP}
                        formatter={(value: number, name: string) => {
                          const dataPoint = chartData.find(
                            (d) => d.minutes === value || d.plays === value
                          );
                          if (name === 'minutes') {
                            return [
                              `${value} min (${dataPoint?.plays || 0} plays)`,
                              'Listening Time',
                            ];
                          }
                          return [value, name];
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground border border-dashed border-input">
                  No listening data available for the selected date range
                </div>
              )}
            </div>

            {/* Top Tracks (for artists only) */}
            {itemType === 'artist' && topTracks.length > 0 && (
              <div>
                <h3 className="label-caps mb-3">Top Tracks by {itemName}</h3>
                <div className="border-t border-border">
                  {topTracks.map((track, index) => (
                    <div
                      key={track.track}
                      className="border-b border-border py-2.5 flex items-center gap-3"
                    >
                      <div className="flex-shrink-0 w-6 text-sm tabular-nums text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {track.track}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {track.plays} plays • {track.minutes} min
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="h-1 w-20 bg-white/10">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(track.minutes / topTracks[0].minutes) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
