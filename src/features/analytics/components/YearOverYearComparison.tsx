import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Calendar } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';
import { formatNumber, msToMinutes } from '@/shared/utils';
import { cn } from '@/shared/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

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
    
    streamingHistory.forEach(entry => {
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
      const tracks = new Set(entries.map(e => `${e.trackName}|||${e.artistName}`));
      const totalTracks = tracks.size;

      // Count unique artists
      const artists = new Set(entries.map(e => e.artistName));
      const totalArtists = artists.size;

      // Get top artist
      const artistCounts = new Map<string, number>();
      entries.forEach(e => {
        artistCounts.set(e.artistName, (artistCounts.get(e.artistName) || 0) + e.msPlayed);
      });
      const topArtist = Array.from(artistCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

      // Get top track
      const trackCounts = new Map<string, number>();
      entries.forEach(e => {
        const key = `${e.trackName}|||${e.artistName}`;
        trackCounts.set(key, (trackCounts.get(key) || 0) + e.msPlayed);
      });
      const topTrackKey = Array.from(trackCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A|||N/A';
      const [topTrack, topTrackArtist] = topTrackKey.split('|||');

      // Calculate average daily
      const uniqueDays = new Set(
        entries.map(e => new Date(e.endTime).toDateString())
      ).size;
      const avgDaily = Math.round((msToMinutes(totalMs) / uniqueDays) || 0);

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
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blue-400" />
            Year-over-Year Comparison
          </CardTitle>
          <CardDescription className="text-white/60">
            Compare your listening habits across different years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/40">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>You need data from at least 2 different years for comparison</p>
            <p className="text-sm mt-2">Upload more streaming history files to see year-over-year trends</p>
          </div>
        </CardContent>
      </Card>
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
  const chartData = yearlyData.map(y => ({
    year: y.year,
    'Total Hours': y.totalHours,
    'Unique Tracks': y.totalTracks,
    'Unique Artists': y.totalArtists,
  }));

  const trendData = yearlyData.map(y => ({
    year: y.year,
    'Daily Average (min)': y.avgDaily,
  }));

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Calendar className="w-7 h-7 text-blue-400" />
              Year-over-Year Comparison
            </CardTitle>
            <CardDescription className="text-white/60 mt-2">
              Track how your listening habits evolved over time
            </CardDescription>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={compareMode === 'overview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCompareMode('overview')}
              className={cn(
                compareMode === 'overview'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white border-white/20 hover:bg-white/10'
              )}
            >
              Overview
            </Button>
            <Button
              variant={compareMode === 'trends' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCompareMode('trends')}
              className={cn(
                compareMode === 'trends'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white border-white/20 hover:bg-white/10'
              )}
            >
              Trends
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {compareMode === 'overview' ? (
          <>
            {/* Year Comparisons */}
            <div className="space-y-4">
              {comparisonData.map((data, index) => (
                <div
                  key={data.year}
                  className={cn(
                    'rounded-xl p-6 border-2 transition-all duration-300',
                    'bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/30 hover:border-blue-500/50'
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-3xl font-bold text-white">{data.year}</h3>
                    {index > 0 && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>vs {yearlyData[index - 1].year}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Total Hours */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Total Hours</p>
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(data.totalHours)}
                      </p>
                      {data.changes && (
                        <div className={cn(
                          'flex items-center gap-1 text-xs mt-1',
                          data.changes.hours.percentage > 0 ? 'text-green-400' : 
                          data.changes.hours.percentage < 0 ? 'text-red-400' : 'text-white/40'
                        )}>
                          {data.changes.hours.percentage > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : data.changes.hours.percentage < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>
                            {data.changes.hours.percentage > 0 ? '+' : ''}
                            {data.changes.hours.percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Unique Tracks */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Tracks</p>
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(data.totalTracks)}
                      </p>
                      {data.changes && (
                        <div className={cn(
                          'flex items-center gap-1 text-xs mt-1',
                          data.changes.tracks.percentage > 0 ? 'text-green-400' : 
                          data.changes.tracks.percentage < 0 ? 'text-red-400' : 'text-white/40'
                        )}>
                          {data.changes.tracks.percentage > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : data.changes.tracks.percentage < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>
                            {data.changes.tracks.percentage > 0 ? '+' : ''}
                            {data.changes.tracks.percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Unique Artists */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Artists</p>
                      <p className="text-2xl font-bold text-white">
                        {formatNumber(data.totalArtists)}
                      </p>
                      {data.changes && (
                        <div className={cn(
                          'flex items-center gap-1 text-xs mt-1',
                          data.changes.artists.percentage > 0 ? 'text-green-400' : 
                          data.changes.artists.percentage < 0 ? 'text-red-400' : 'text-white/40'
                        )}>
                          {data.changes.artists.percentage > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : data.changes.artists.percentage < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>
                            {data.changes.artists.percentage > 0 ? '+' : ''}
                            {data.changes.artists.percentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Daily Average */}
                    <div>
                      <p className="text-white/60 text-sm mb-1">Daily Avg</p>
                      <p className="text-2xl font-bold text-white">
                        {data.avgDaily} min
                      </p>
                      {data.changes && (
                        <div className={cn(
                          'flex items-center gap-1 text-xs mt-1',
                          data.changes.avgDaily.percentage > 0 ? 'text-green-400' : 
                          data.changes.avgDaily.percentage < 0 ? 'text-red-400' : 'text-white/40'
                        )}>
                          {data.changes.avgDaily.percentage > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : data.changes.avgDaily.percentage < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>
                            {data.changes.avgDaily.percentage > 0 ? '+' : ''}
                            {data.changes.avgDaily.percentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Items */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-white/40">Top Artist</p>
                        <p className="text-white font-medium truncate">{data.topArtist}</p>
                      </div>
                      <div>
                        <p className="text-white/40">Top Track</p>
                        <p className="text-white font-medium truncate">
                          {data.topTrack} - {data.topTrackArtist}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Trends Charts */}
            <div className="space-y-6">
              {/* Bar Chart */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Overall Growth</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="year"
                        stroke="rgba(255,255,255,0.6)"
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.6)"
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                        }}
                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="Total Hours" fill="#1db954" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Unique Tracks" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Unique Artists" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Line Chart */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Daily Average Trend</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="year"
                        stroke="rgba(255,255,255,0.6)"
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.6)"
                        tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Daily Average (min)"
                        stroke="#1db954"
                        strokeWidth={3}
                        dot={{ fill: '#1db954', r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

