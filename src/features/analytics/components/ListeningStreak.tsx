import { useMemo } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Flame, Calendar, TrendingUp } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';
import { formatNumber } from '@/shared/utils';

export function ListeningStreak() {
  const { streamingHistory } = useSpotifyData();

  const streakData = useMemo(() => {
    if (!streamingHistory || streamingHistory.length === 0) return null;

    // Get unique days with listening activity
    const listeningDays = new Set<string>();
    const dailyMinutes = new Map<string, number>();

    streamingHistory.forEach(entry => {
      const date = new Date(entry.endTime);
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      listeningDays.add(dayKey);
      
      const minutes = entry.msPlayed / 1000 / 60;
      dailyMinutes.set(dayKey, (dailyMinutes.get(dayKey) || 0) + minutes);
    });

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    const sortedDaysAsc = Array.from(listeningDays).sort();

    for (let i = 1; i < sortedDaysAsc.length; i++) {
      const prevDate = new Date(sortedDaysAsc[i - 1]);
      const currDate = new Date(sortedDaysAsc[i]);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate average minutes per active day
    const totalMinutes = Array.from(dailyMinutes.values()).reduce((sum, min) => sum + min, 0);
    const avgMinutesPerActiveDay = Math.round(totalMinutes / listeningDays.size);

    // Find most active day
    let maxMinutes = 0;
    let maxDay = '';
    dailyMinutes.forEach((minutes, day) => {
      if (minutes > maxMinutes) {
        maxMinutes = minutes;
        maxDay = day;
      }
    });

    return {
      longestStreak,
      totalActiveDays: listeningDays.size,
      avgMinutesPerActiveDay,
      maxDay,
      maxMinutes: Math.round(maxMinutes),
    };
  }, [streamingHistory]);

  if (!streakData) return null;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Longest Streak */}
          <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border-2 border-amber-500/30 rounded-lg p-6 text-center hover:scale-105 transition-all duration-300">
            <Flame className="w-8 h-8 text-amber-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{streakData.longestStreak}</p>
            <p className="text-sm text-white/70 font-medium">Best Streak</p>
            <p className="text-xs text-white/50 mt-1">Consecutive days</p>
          </div>

          {/* Total Active Days */}
          <div className="bg-gradient-to-br from-teal-500/20 to-cyan-600/20 border-2 border-teal-500/30 rounded-lg p-6 text-center hover:scale-105 transition-all duration-300">
            <Calendar className="w-8 h-8 text-teal-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{formatNumber(streakData.totalActiveDays)}</p>
            <p className="text-sm text-white/70 font-medium">Active Days</p>
            <p className="text-xs text-white/50 mt-1">Days with activity</p>
          </div>

          {/* Average per Active Day */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-2 border-green-500/30 rounded-lg p-6 text-center hover:scale-105 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{formatNumber(streakData.avgMinutesPerActiveDay)}</p>
            <p className="text-sm text-white/70 font-medium">Avg Minutes</p>
            <p className="text-xs text-white/50 mt-1">Per active day</p>
          </div>

          {/* Most Active Day */}
          <div className="bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border-2 border-emerald-400/30 rounded-lg p-6 text-center hover:scale-105 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-2">{formatNumber(streakData.maxMinutes)}</p>
            <p className="text-sm text-white/70 font-medium">Peak Day</p>
            <p className="text-xs text-white/50 mt-1">
              {new Date(streakData.maxDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Summary Text */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/80 text-sm text-center">
            You listened to music on <span className="font-bold text-white">{formatNumber(streakData.totalActiveDays)} days</span>, 
            with your best streak being <span className="font-bold text-white">{streakData.longestStreak} consecutive days</span>. 
            On active days, you averaged <span className="font-bold text-white">{formatNumber(streakData.avgMinutesPerActiveDay)} minutes</span> of listening.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
