import { useMemo } from 'react';
import { useSpotifyData } from '@/shared/hooks';
import { formatNumber } from '@/shared/utils';

export function ListeningStreak() {
  const { streamingHistory } = useSpotifyData();

  const streakData = useMemo(() => {
    if (!streamingHistory || streamingHistory.length === 0) return null;

    // Get unique days with listening activity
    const listeningDays = new Set<string>();
    const dailyMinutes = new Map<string, number>();

    streamingHistory.forEach((entry) => {
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

  const stats = [
    {
      value: formatNumber(streakData.longestStreak),
      label: 'Best Streak',
      detail: 'Consecutive days',
    },
    {
      value: formatNumber(streakData.totalActiveDays),
      label: 'Active Days',
      detail: 'Days with activity',
    },
    {
      value: formatNumber(streakData.avgMinutesPerActiveDay),
      label: 'Avg Minutes',
      detail: 'Per active day',
    },
    {
      value: formatNumber(streakData.maxMinutes),
      label: 'Peak Day',
      detail: new Date(streakData.maxDay).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    },
  ];

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 border-t border-border">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col py-4 border-b border-border">
            <dt className="label-caps mt-1 order-2">{stat.label}</dt>
            <dd className="order-1 text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em] tabular-nums">
              {stat.value}
            </dd>
            <dd className="order-3 text-xs text-muted-foreground mt-0.5">{stat.detail}</dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-muted-foreground max-w-prose leading-relaxed">
        You listened to music on{' '}
        <span className="font-semibold text-foreground">
          {formatNumber(streakData.totalActiveDays)} days
        </span>
        , with your best streak being{' '}
        <span className="font-semibold text-foreground">
          {formatNumber(streakData.longestStreak)} consecutive days
        </span>
        . On active days, you averaged{' '}
        <span className="font-semibold text-foreground">
          {formatNumber(streakData.avgMinutesPerActiveDay)} minutes
        </span>{' '}
        of listening.
      </p>
    </div>
  );
}
