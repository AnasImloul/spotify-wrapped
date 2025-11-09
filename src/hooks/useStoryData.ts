import { useMemo } from 'react';
import { useSpotifyDataContext } from '@/contexts/SpotifyDataContext';
import { useDateRange } from './useDateRange';
import { msToMinutes } from '@/lib/utils';

export interface StoryInsights {
  // Top items
  topArtist: { name: string; minutes: number; playCount: number } | null;
  topTrack: { name: string; artist: string; minutes: number; playCount: number } | null;
  
  // Totals
  totalMinutes: number;
  totalTracks: number;
  uniqueArtists: number;
  uniqueTracks: number;
  
  // Discovery
  artistsDiscovered: number;
  tracksDiscovered: number;
  
  // Patterns
  listeningStreak: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  peakListeningHour: number;
  
  // Comparisons
  funFact: string;
  
  // Date range
  startDate: string;
  endDate: string;
}

/**
 * Hook to compute insights for story cards
 */
export function useStoryData(): StoryInsights | null {
  const { stats, streamingHistory } = useSpotifyDataContext();
  const { startDate, endDate } = useDateRange();

  return useMemo(() => {
    if (!stats) return null;

    // Top artist
    const topArtist = stats.topArtists[0]
      ? {
          name: stats.topArtists[0].name,
          minutes: msToMinutes(stats.topArtists[0].totalMs),
          playCount: stats.topArtists[0].playCount,
        }
      : null;

    // Top track
    const topTrack = stats.topTracks[0]
      ? {
          name: stats.topTracks[0].name,
          artist: stats.topTracks[0].artist,
          minutes: msToMinutes(stats.topTracks[0].totalMs),
          playCount: stats.topTracks[0].playCount,
        }
      : null;

    // Calculate listening streak
    const streak = calculateListeningStreak(streamingHistory);

    // Calculate time of day preference
    const { timeOfDay, peakHour } = calculateTimeOfDay(streamingHistory);

    // Generate fun fact
    const totalMinutesFromHours = Math.round(stats.totalListeningTime * 60);
    const funFact = generateFunFact(totalMinutesFromHours);

    return {
      topArtist,
      topTrack,
      totalMinutes: totalMinutesFromHours,
      totalTracks: stats.totalTracks,
      uniqueArtists: stats.totalArtists,
      uniqueTracks: stats.totalTracks, // Using totalTracks as unique tracks count
      artistsDiscovered: stats.totalArtists,
      tracksDiscovered: stats.totalTracks,
      listeningStreak: streak,
      timeOfDay,
      peakListeningHour: peakHour,
      funFact,
      startDate,
      endDate,
    };
  }, [stats, streamingHistory, startDate, endDate]);
}

/**
 * Calculate longest listening streak (consecutive days)
 */
function calculateListeningStreak(history: any[]): number {
  if (history.length === 0) return 0;

  // Extract dates in YYYY-MM-DD format for proper sorting
  const dateStrings = history.map((entry) => {
    const date = new Date(entry.endTime || entry.ts);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  // Get unique dates and sort chronologically
  const uniqueDates = Array.from(new Set(dateStrings)).sort();

  if (uniqueDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Calculate time of day preference
 */
function calculateTimeOfDay(history: any[]): {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  peakHour: number;
} {
  if (history.length === 0) {
    return { timeOfDay: 'afternoon', peakHour: 12 };
  }

  const hourCounts: { [key: number]: number } = {};

  history.forEach((entry) => {
    const date = new Date(entry.endTime || entry.ts);
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  // Find peak hour
  let peakHour = 12;
  let maxCount = 0;
  Object.entries(hourCounts).forEach(([hour, count]) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = parseInt(hour);
    }
  });

  // Determine time of day
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  if (peakHour >= 5 && peakHour < 12) {
    timeOfDay = 'morning';
  } else if (peakHour >= 12 && peakHour < 17) {
    timeOfDay = 'afternoon';
  } else if (peakHour >= 17 && peakHour < 21) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }

  return { timeOfDay, peakHour };
}

/**
 * Generate fun fact comparison
 */
function generateFunFact(minutes: number): string {
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (days >= 30) {
    const months = Math.round(days / 30);
    return `That's ${months} month${months > 1 ? 's' : ''} of non-stop music!`;
  } else if (days >= 7) {
    const weeks = Math.round(days / 7);
    return `That's ${weeks} week${weeks > 1 ? 's' : ''} of continuous listening!`;
  } else if (days >= 1) {
    return `That's ${days} day${days > 1 ? 's' : ''} of pure music!`;
  } else if (hours >= 1) {
    return `That's ${hours} hour${hours > 1 ? 's' : ''} of awesome tunes!`;
  } else {
    return `Every minute counts!`;
  }
}

