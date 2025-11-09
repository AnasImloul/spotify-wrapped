import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Sunrise, Sunset, Zap, Heart, Coffee, Music } from 'lucide-react';
import { useSpotifyData } from '@/hooks';
import { cn } from '@/lib/utils';

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

    streamingHistory.forEach(entry => {
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
    const peakTime = peakHour === 0 ? '12 AM' : peakHour < 12 ? `${peakHour} AM` : peakHour === 12 ? '12 PM' : `${peakHour - 12} PM`;
    insights.push(`Your peak listening hour was ${peakTime}`);

    // Consistency analysis
    const nonZeroHours = hourlyActivity.filter(h => h > 0).length;
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
      icon: Sunrise,
      mood: moodProfile.morningMood,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/40',
      description: 'Energetic & Fresh',
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      time: '12 PM - 6 PM',
      icon: Sun,
      mood: moodProfile.afternoonMood,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/40',
      description: 'Focused & Productive',
    },
    {
      id: 'evening',
      label: 'Evening',
      time: '6 PM - 12 AM',
      icon: Sunset,
      mood: moodProfile.eveningMood,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/40',
      description: 'Relaxed & Chill',
    },
    {
      id: 'night',
      label: 'Night',
      time: '12 AM - 6 AM',
      icon: Moon,
      mood: moodProfile.nightMood,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/40',
      description: 'Calm & Introspective',
    },
  ];

  const dominantProfiles = {
    energetic: {
      title: 'Energetic Listener',
      description: 'You used music to fuel your energy and start your days strong',
      icon: Zap,
      color: 'text-yellow-400',
    },
    focused: {
      title: 'Focused Listener',
      description: 'Music helped you stay productive and concentrate during this period',
      icon: Coffee,
      color: 'text-orange-400',
    },
    relaxed: {
      title: 'Relaxed Listener',
      description: 'You wound down with music, using it to relax and unwind',
      icon: Heart,
      color: 'text-purple-400',
    },
    varied: {
      title: 'Balanced Listener',
      description: 'You enjoyed music at all times throughout your listening history',
      icon: Music,
      color: 'text-green-400',
    },
  };

  const profile = dominantProfiles[moodProfile.dominant];
  const ProfileIcon = profile.icon;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <Zap className="w-7 h-7 text-yellow-400" />
          Mood & Energy Profile
        </CardTitle>
        <CardDescription className="text-white/60">
          Understand when you listened to music most throughout your history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dominant Profile */}
        <div className={`bg-gradient-to-br ${profile.color === 'text-yellow-400' ? 'from-yellow-500/20 to-orange-500/20' : profile.color === 'text-orange-400' ? 'from-orange-500/20 to-red-500/20' : profile.color === 'text-purple-400' ? 'from-purple-500/20 to-pink-500/20' : 'from-green-500/20 to-emerald-500/20'} rounded-xl p-6 border-2 ${profile.color === 'text-yellow-400' ? 'border-yellow-500/40' : profile.color === 'text-orange-400' ? 'border-orange-500/40' : profile.color === 'text-purple-400' ? 'border-purple-500/40' : 'border-green-500/40'}`}>
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br ${profile.color === 'text-yellow-400' ? 'from-yellow-500 to-orange-500' : profile.color === 'text-orange-400' ? 'from-orange-500 to-red-500' : profile.color === 'text-purple-400' ? 'from-purple-500 to-pink-500' : 'from-green-500 to-emerald-500'} flex items-center justify-center shadow-lg`}>
              <ProfileIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{profile.title}</h3>
              <p className="text-sm text-white/60">{profile.description}</p>
            </div>
          </div>
        </div>

        {/* Time of Day Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeOfDayData.map((period) => {
            const Icon = period.icon;

            return (
              <div
                key={period.id}
                className={cn(
                  'rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105',
                  `bg-gradient-to-br ${period.bgColor} ${period.borderColor}`
                )}
              >
                <Icon className="w-8 h-8 text-white mb-3" />
                <h4 className="font-bold text-white mb-1">{period.label}</h4>
                <p className="text-xs text-white/60 mb-2">{period.time}</p>
                <p className="text-sm text-white/80 mb-2">{period.description}</p>
                <p className="text-sm font-semibold text-white">{period.mood}</p>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Your Listening Insights
          </h3>
          <div className="space-y-3">
            {moodProfile.insights.map((insight, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <p className="text-white/90">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Import Sparkles for the component
import { Sparkles } from 'lucide-react';

