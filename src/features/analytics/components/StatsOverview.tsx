import { Music, Headphones, Calendar, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatNumber, msToMinutes } from '@/shared/utils';
import { useFilteredStats } from '@/shared/hooks';

export function StatsOverview() {
  const stats = useFilteredStats();

  if (!stats) {
    return null;
}
  const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
  const totalHours = Math.round(totalMinutes / 60);
  const totalDays = Math.round(totalHours / 24);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="stat-card bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Listening Time</CardTitle>
          <Clock className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-400">
            {formatNumber(totalMinutes)} min
          </div>
          <p className="text-xs text-white/60 mt-2">
            That's {formatNumber(totalHours)} hours or {totalDays} days of pure music!
          </p>
        </CardContent>
      </Card>

      <Card className="stat-card bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Tracks Played</CardTitle>
          <Music className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-300">
            {formatNumber(stats.totalTracks)}
          </div>
          <p className="text-xs text-white/60 mt-2">
            Different songs in your library
          </p>
        </CardContent>
      </Card>

      <Card className="stat-card bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Artists Discovered</CardTitle>
          <Headphones className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-300">
            {formatNumber(stats.totalArtists)}
          </div>
          <p className="text-xs text-white/60 mt-2">
            Unique artists you've enjoyed
          </p>
        </CardContent>
      </Card>

      {stats.averageListeningPerDay > 0 && (
        <Card className="stat-card bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/25">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-300">
              {Math.round(stats.averageListeningPerDay)} min
            </div>
            <p className="text-xs text-white/60 mt-2">
              Average listening time per day
            </p>
          </CardContent>
        </Card>
      )}

      {stats.yearlyMetrics && (
        <Card className="stat-card bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/25">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Top Listener</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-300">
              Top {Math.round(100 - stats.yearlyMetrics.percentGreaterThanWorldwideUsers)}%
            </div>
            <p className="text-xs text-white/60 mt-2">
              You listened more than {stats.yearlyMetrics.percentGreaterThanWorldwideUsers.toFixed(1)}% of Spotify users
            </p>
          </CardContent>
        </Card>
      )}

      {stats.mostActiveDay && (
        <Card className="stat-card bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/25">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Most Active Day</CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-300">
              {new Date(stats.mostActiveDay).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <p className="text-xs text-white/60 mt-2">
              {stats.mostActiveDayMinutes ? `${formatNumber(stats.mostActiveDayMinutes)} minutes played` : 'Your most music-filled day'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

