import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Calendar } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';
import { formatNumber, msToMinutes } from '@/shared/utils';
import { cn } from '@/shared/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  CHART_AXIS,
  CHART_COLORS,
  CHART_GRID,
  CHART_SERIES,
  CHART_TOOLTIP,
} from '@/shared/constants/charts';

interface YearlyStats {
  year: string;
  totalHours: number;
  totalTracks: number;
  totalArtists: number;
  topArtist: string;
  topTrack: string;
  topTrackArtist: string;
  avgDaily: number;
}

export function YearOverYearComparison() {
  const { streamingHistory } = useSpotifyData();
  const [compareMode, setCompareMode] = useState<'overview' | 'trends'>('overview');

  const yearlyData = useMemo((): YearlyStats[] => {
    if (!streamingHistory || streamingHistory.length === 0) return [];

    // Group data by year
    const yearMap = new Map<string, any[]>();

    streamingHistory.forEach((entry) => {
      const year = new Date(entry.endTime).getFullYear().toString();
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(entry);
    });

    // Calculate stats for each year
    const yearlyStats: YearlyStats[] = [];

    yearMap.forEach((entries, year) => {
      const totalMs = entries.reduce((sum, e) => sum + e.msPlayed, 0);
      const totalHours = Math.round(msToMinutes(totalMs) / 60);

      // Count unique tracks
      const tracks = new Set(entries.map((e) => `${e.trackName}|||${e.artistName}`));
      const totalTracks = tracks.size;

      // Count unique artists
      const artists = new Set(entries.map((e) => e.artistName));
      const totalArtists = artists.size;

      // Get top artist
      const artistCounts = new Map<string, number>();
      entries.forEach((e) => {
        artistCounts.set(e.artistName, (artistCounts.get(e.artistName) || 0) + e.msPlayed);
      });
      const topArtist =
        Array.from(artistCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Get top track
      const trackCounts = new Map<string, number>();
      entries.forEach((e) => {
        const key = `${e.trackName}|||${e.artistName}`;
        trackCounts.set(key, (trackCounts.get(key) || 0) + e.msPlayed);
      });
      const topTrackKey =
        Array.from(trackCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A|||N/A';
      const [topTrack, topTrackArtist] = topTrackKey.split('|||');

      // Calculate average daily
      const uniqueDays = new Set(entries.map((e) => new Date(e.endTime).toDateString())).size;
      const avgDaily = Math.round(msToMinutes(totalMs) / uniqueDays || 0);

      yearlyStats.push({
        year,
        totalHours,
        totalTracks,
        totalArtists,
        topArtist,
        topTrack,
        topTrackArtist,
        avgDaily,
      });
    });

    return yearlyStats.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [streamingHistory]);

  if (yearlyData.length < 2) {
    return (
      <div className="border border-dashed border-input px-6 py-14 text-center">
        <Calendar className="w-8 h-8 mx-auto mb-3 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground mb-4">
          Compare your listening habits across different years
        </p>
        <p className="font-medium">You need data from at least 2 different years for comparison</p>
        <p className="text-sm text-muted-foreground mt-2">
          Upload more streaming history files to see year-over-year trends
        </p>
      </div>
    );
  }

  // Calculate year-over-year changes
  const getChange = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, percentage: 0 };
    const change = current - previous;
    const percentage = Math.round((change / previous) * 100);
    return { value: change, percentage };
  };

  // Prepare comparison data
  const comparisonData = yearlyData.map((yearData, index) => {
    if (index === 0) return { ...yearData, changes: null };

    const previous = yearlyData[index - 1];
    return {
      ...yearData,
      changes: {
        hours: getChange(yearData.totalHours, previous.totalHours),
        tracks: getChange(yearData.totalTracks, previous.totalTracks),
        artists: getChange(yearData.totalArtists, previous.totalArtists),
        avgDaily: getChange(yearData.avgDaily, previous.avgDaily),
      },
    };
  });

  // Chart data
  const chartData = yearlyData.map((y) => ({
    year: y.year,
    'Total Hours': y.totalHours,
    'Unique Tracks': y.totalTracks,
    'Unique Artists': y.totalArtists,
  }));

  const trendData = yearlyData.map((y) => ({
    year: y.year,
    'Daily Average (min)': y.avgDaily,
  }));

  const segment = (active: boolean) =>
    cn(
      'h-8 px-3 text-sm font-medium transition-colors border-r border-input last:border-r-0',
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
    );

  const metrics = [
    { key: 'hours', label: 'Total Hours', value: (d: YearlyStats) => formatNumber(d.totalHours) },
    { key: 'tracks', label: 'Tracks', value: (d: YearlyStats) => formatNumber(d.totalTracks) },
    { key: 'artists', label: 'Artists', value: (d: YearlyStats) => formatNumber(d.totalArtists) },
    { key: 'avgDaily', label: 'Daily Avg', value: (d: YearlyStats) => `${d.avgDaily} min` },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Track how your listening habits evolved over time
        </p>
        <div
          role="group"
          aria-label="Year-over-year view"
          className="flex border border-input self-start"
        >
          <button
            onClick={() => setCompareMode('overview')}
            aria-pressed={compareMode === 'overview'}
            className={segment(compareMode === 'overview')}
          >
            Overview
          </button>
          <button
            onClick={() => setCompareMode('trends')}
            aria-pressed={compareMode === 'trends'}
            className={segment(compareMode === 'trends')}
          >
            Trends
          </button>
        </div>
      </div>

      {compareMode === 'overview' ? (
        <div className="space-y-4">
          {comparisonData.map((data, index) => (
            <div key={data.year} className="border border-border bg-card p-4 sm:p-6">
              <div className="flex items-baseline justify-between gap-4 mb-4 pb-3 border-b border-foreground">
                <h4 className="text-3xl font-medium tabular-nums">{data.year}</h4>
                {index > 0 && (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    vs {yearlyData[index - 1].year}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </span>
                )}
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
                {metrics.map((metric) => {
                  const change = data.changes?.[metric.key];
                  return (
                    <div key={metric.key} className="flex flex-col">
                      <dt className="label-caps mt-1 order-2">{metric.label}</dt>
                      <dd className="order-1 text-2xl font-medium tabular-nums">
                        {metric.value(data)}
                      </dd>
                      {change && (
                        <dd
                          className={cn(
                            'order-3 flex items-center gap-1 text-xs mt-1 tabular-nums',
                            change.percentage > 0
                              ? 'text-primary'
                              : change.percentage < 0
                                ? 'text-code-orange'
                                : 'text-muted-foreground'
                          )}
                        >
                          {change.percentage > 0 ? (
                            <TrendingUp className="w-3 h-3" aria-hidden />
                          ) : change.percentage < 0 ? (
                            <TrendingDown className="w-3 h-3" aria-hidden />
                          ) : (
                            <Minus className="w-3 h-3" aria-hidden />
                          )}
                          <span>
                            {change.percentage > 0 ? '+' : ''}
                            {change.percentage}%
                          </span>
                        </dd>
                      )}
                    </div>
                  );
                })}
              </dl>

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="min-w-0">
                  <p className="label-caps">Top Artist</p>
                  <p className="font-medium truncate mt-1">{data.topArtist}</p>
                </div>
                <div className="min-w-0">
                  <p className="label-caps">Top Track</p>
                  <p className="font-medium truncate mt-1">
                    {data.topTrack} - {data.topTrackArtist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h4 className="label-caps mb-3">Overall Growth</h4>
            <div className="h-[300px] border border-border p-3 sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid {...CHART_GRID} />
                  <XAxis dataKey="year" {...CHART_AXIS} />
                  <YAxis {...CHART_AXIS} axisLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Legend wrapperStyle={{ fontSize: 12, color: CHART_COLORS.textMuted }} />
                  <Bar dataKey="Total Hours" fill={CHART_SERIES[0]} />
                  <Bar dataKey="Unique Tracks" fill={CHART_SERIES[1]} />
                  <Bar dataKey="Unique Artists" fill={CHART_SERIES[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="label-caps mb-3">Daily Average Trend</h4>
            <div className="h-[250px] border border-border p-3 sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid {...CHART_GRID} />
                  <XAxis dataKey="year" {...CHART_AXIS} />
                  <YAxis {...CHART_AXIS} axisLine={false} />
                  <Tooltip {...CHART_TOOLTIP} />
                  <Line
                    type="monotone"
                    dataKey="Daily Average (min)"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.primary, stroke: CHART_COLORS.primary, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
