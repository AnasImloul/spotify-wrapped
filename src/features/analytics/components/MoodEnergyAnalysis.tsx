import { useMemo } from 'react';
import { TIME_OF_DAY_SWATCH } from '@/shared/constants/charts';
import { useSpotifyData } from '@/shared/hooks';
import { cn } from '@/shared/utils';

interface MoodProfile {
  dominant: 'energetic' | 'relaxed' | 'focused' | 'varied';
  morningMood: string;
  afternoonMood: string;
  eveningMood: string;
  nightMood: string;
  insights: string[];
}

export function MoodEnergyAnalysis() {
  const { streamingHistory } = useSpotifyData();

  const moodProfile = useMemo((): MoodProfile | null => {
    if (!streamingHistory || streamingHistory.length === 0) return null;

    // Analyze listening patterns by time of day
    const timeDistribution = {
      morning: 0, // 6am-12pm
      afternoon: 0, // 12pm-6pm
      evening: 0, // 6pm-12am
      night: 0, // 12am-6am
    };

    const hourlyActivity = new Array(24).fill(0);

    streamingHistory.forEach((entry) => {
      const date = new Date(entry.endTime);
      const hour = date.getHours();
      const minutes = entry.msPlayed / 1000 / 60;

      hourlyActivity[hour] += minutes;

      if (hour >= 6 && hour < 12) timeDistribution.morning += minutes;
      else if (hour >= 12 && hour < 18) timeDistribution.afternoon += minutes;
      else if (hour >= 18 && hour < 24) timeDistribution.evening += minutes;
      else timeDistribution.night += minutes;
    });

    const total = Object.values(timeDistribution).reduce((a, b) => a + b, 0);
    const percentages = {
      morning: (timeDistribution.morning / total) * 100,
      afternoon: (timeDistribution.afternoon / total) * 100,
      evening: (timeDistribution.evening / total) * 100,
      night: (timeDistribution.night / total) * 100,
    };

    // Determine dominant listening pattern
    const maxPeriod = Object.entries(percentages).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0] as keyof typeof percentages;

    let dominant: MoodProfile['dominant'] = 'varied';
    if (percentages[maxPeriod] > 40) {
      if (maxPeriod === 'morning') dominant = 'energetic';
      else if (maxPeriod === 'afternoon') dominant = 'focused';
      else if (maxPeriod === 'evening') dominant = 'relaxed';
      else dominant = 'varied';
    }

    // Generate mood descriptions
    const getMood = (percentage: number, period: string) => {
      if (percentage > 35) return `${period} Enthusiast`;
      if (percentage > 25) return `${period} Lover`;
      if (percentage > 15) return `${period} Listener`;
      return `Occasional ${period}`;
    };

    const morningMood = getMood(percentages.morning, 'Morning');
    const afternoonMood = getMood(percentages.afternoon, 'Afternoon');
    const eveningMood = getMood(percentages.evening, 'Evening');
    const nightMood = getMood(percentages.night, 'Night');

    // Generate insights
    const insights: string[] = [];

    if (percentages.morning > 30) {
      insights.push('You were an early bird! Most of your listening happened in the morning.');
    }
    if (percentages.night > 25) {
      insights.push('Night owl confirmed - you listened to a lot of music during late hours.');
    }
    if (percentages.afternoon > 35) {
      insights.push('Afternoon was your prime time for music throughout this period.');
    }
    if (percentages.evening > 40) {
      insights.push('Evening was when you unwound with your favorite tunes most often.');
    }

    // Peak listening hour
    const peakHour = hourlyActivity.indexOf(Math.max(...hourlyActivity));
    const peakTime =
      peakHour === 0
        ? '12 AM'
        : peakHour < 12
          ? `${peakHour} AM`
          : peakHour === 12
            ? '12 PM'
            : `${peakHour - 12} PM`;
    insights.push(`Your peak listening hour was ${peakTime}`);

    // Consistency analysis
    const nonZeroHours = hourlyActivity.filter((h) => h > 0).length;
    if (nonZeroHours > 18) {
      insights.push('You listened to music throughout the day - it was part of your rhythm!');
    } else if (nonZeroHours < 8) {
      insights.push('You had specific times for music - intentional about when you listened.');
    }

    return {
      dominant,
      morningMood,
      afternoonMood,
      eveningMood,
      nightMood,
      insights,
    };
  }, [streamingHistory]);

  if (!moodProfile) return null;

  const timeOfDayData = [
    {
      id: 'morning',
      label: 'Morning',
      time: '6 AM - 12 PM',
      mood: moodProfile.morningMood,
      swatch: TIME_OF_DAY_SWATCH.morning,
      description: 'Energetic & Fresh',
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      time: '12 PM - 6 PM',
      mood: moodProfile.afternoonMood,
      swatch: TIME_OF_DAY_SWATCH.afternoon,
      description: 'Focused & Productive',
    },
    {
      id: 'evening',
      label: 'Evening',
      time: '6 PM - 12 AM',
      mood: moodProfile.eveningMood,
      swatch: TIME_OF_DAY_SWATCH.evening,
      description: 'Relaxed & Chill',
    },
    {
      id: 'night',
      label: 'Night',
      time: '12 AM - 6 AM',
      mood: moodProfile.nightMood,
      swatch: TIME_OF_DAY_SWATCH.night,
      description: 'Calm & Introspective',
    },
  ];

  const dominantProfiles = {
    energetic: {
      title: 'Energetic Listener',
      description: 'You used music to fuel your energy and start your days strong',
    },
    focused: {
      title: 'Focused Listener',
      description: 'Music helped you stay productive and concentrate during this period',
    },
    relaxed: {
      title: 'Relaxed Listener',
      description: 'You wound down with music, using it to relax and unwind',
    },
    varied: {
      title: 'Balanced Listener',
      description: 'You enjoyed music at all times throughout your listening history',
    },
  };

  const profile = dominantProfiles[moodProfile.dominant];

  return (
    <div className="space-y-8">
      <div>
        <div>
          <p className="text-3xl lg:text-4xl font-medium leading-tight tracking-[-0.02em]">
            {profile.title}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{profile.description}</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 border-t border-border">
        {timeOfDayData.map((period) => (
          <li key={period.id} className="py-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('h-2.5 w-2.5 flex-shrink-0', period.swatch)} aria-hidden />
              <h4 className="label-caps">{period.label}</h4>
            </div>
            <p className="text-lg font-medium">{period.mood}</p>
            <p className="text-sm text-muted-foreground mt-1">{period.description}</p>
            <p className="text-xs text-muted-foreground mt-2 tabular-nums">{period.time}</p>
          </li>
        ))}
      </ul>

      <div>
        <h4 className="label-caps pb-2 border-b border-foreground">Your Listening Insights</h4>
        <ul>
          {moodProfile.insights.map((insight, index) => (
            <li key={index} className="py-3 border-b border-border text-foreground">
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
