import { ProcessedStats, StreamingHistoryEntry } from '@/shared/types';
import { msToMinutes } from './utils';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'listening' | 'discovery' | 'dedication' | 'variety' | 'special';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface PersonalRecord {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string; // Now uses string identifier instead of emoji
  category: 'time' | 'streak' | 'variety' | 'artist' | 'track';
}

/**
 * Calculate all achievements based on user stats
 */
export function calculateAchievements(
  stats: ProcessedStats,
  streamingHistory: StreamingHistoryEntry[]
): Achievement[] {
  const achievements: Achievement[] = [];
  const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 24;

  // Listening Time Achievements
  if (totalHours >= 1) {
    achievements.push({
      id: 'first-hour',
      title: 'Getting Started',
      description: 'Listened to 1+ hour of music',
      icon: '🎵',
      tier: 'bronze',
      category: 'listening',
      unlocked: true,
    });
  }

  if (totalHours >= 100) {
    achievements.push({
      id: 'century',
      title: 'Century Club',
      description: 'Reached 100 hours of listening',
      icon: '💯',
      tier: 'silver',
      category: 'listening',
      unlocked: true,
    });
  }

  if (totalHours >= 500) {
    achievements.push({
      id: 'half-thousand',
      title: 'Music Enthusiast',
      description: 'Listened to 500+ hours',
      icon: '🔥',
      tier: 'gold',
      category: 'listening',
      unlocked: true,
    });
  }

  if (totalHours >= 1000) {
    achievements.push({
      id: 'thousand',
      title: 'Music Aficionado',
      description: 'Reached 1,000 hours',
      icon: '🌟',
      tier: 'platinum',
      category: 'listening',
      unlocked: true,
    });
  }

  if (totalDays >= 30) {
    achievements.push({
      id: 'month-of-music',
      title: 'Month of Music',
      description: 'Listened to 30+ days worth of music',
      icon: '📅',
      tier: 'diamond',
      category: 'listening',
      unlocked: true,
    });
  }

  // Discovery Achievements
  if (stats.totalArtists >= 50) {
    achievements.push({
      id: 'explorer-50',
      title: 'Music Explorer',
      description: 'Discovered 50+ different artists',
      icon: '🧭',
      tier: 'bronze',
      category: 'discovery',
      unlocked: true,
    });
  }

  if (stats.totalArtists >= 200) {
    achievements.push({
      id: 'explorer-200',
      title: 'Taste Maker',
      description: 'Explored 200+ artists',
      icon: '🎨',
      tier: 'silver',
      category: 'discovery',
      unlocked: true,
    });
  }

  if (stats.totalArtists >= 500) {
    achievements.push({
      id: 'explorer-500',
      title: 'Music Connoisseur',
      description: 'Discovered 500+ unique artists',
      icon: '🏆',
      tier: 'gold',
      category: 'discovery',
      unlocked: true,
    });
  }

  if (stats.totalArtists >= 1000) {
    achievements.push({
      id: 'explorer-1000',
      title: 'Genre Master',
      description: 'Listened to 1,000+ different artists',
      icon: '👑',
      tier: 'platinum',
      category: 'discovery',
      unlocked: true,
    });
  }

  // Track Variety Achievements
  if (stats.totalTracks >= 100) {
    achievements.push({
      id: 'variety-100',
      title: 'Playlist Builder',
      description: 'Listened to 100+ different tracks',
      icon: '📝',
      tier: 'bronze',
      category: 'variety',
      unlocked: true,
    });
  }

  if (stats.totalTracks >= 500) {
    achievements.push({
      id: 'variety-500',
      title: 'Track Collector',
      description: 'Enjoyed 500+ unique songs',
      icon: '💿',
      tier: 'silver',
      category: 'variety',
      unlocked: true,
    });
  }

  if (stats.totalTracks >= 2000) {
    achievements.push({
      id: 'variety-2000',
      title: 'Music Library',
      description: 'Listened to 2,000+ different tracks',
      icon: '📚',
      tier: 'gold',
      category: 'variety',
      unlocked: true,
    });
  }

  if (stats.totalTracks >= 5000) {
    achievements.push({
      id: 'variety-5000',
      title: 'Song Encyclopedia',
      description: 'Explored 5,000+ tracks',
      icon: '🎼',
      tier: 'platinum',
      category: 'variety',
      unlocked: true,
    });
  }

  // Dedication Achievements
  const topArtist = stats.topArtists[0];
  if (topArtist) {
    const topArtistHours = msToMinutes(topArtist.totalMs) / 60;
    
    if (topArtistHours >= 10) {
      achievements.push({
        id: 'super-fan-10',
        title: 'Super Fan',
        description: `Listened to ${topArtist.name} for 10+ hours`,
        icon: '⭐',
        tier: 'bronze',
        category: 'dedication',
        unlocked: true,
      });
    }

    if (topArtistHours >= 50) {
      achievements.push({
        id: 'super-fan-50',
        title: 'Devoted Listener',
        description: `${topArtist.name} superfan - 50+ hours`,
        icon: '💫',
        tier: 'silver',
        category: 'dedication',
        unlocked: true,
      });
    }

    if (topArtistHours >= 100) {
      achievements.push({
        id: 'super-fan-100',
        title: 'Ultimate Fan',
        description: `Dedicated 100+ hours to ${topArtist.name}`,
        icon: '🌠',
        tier: 'gold',
        category: 'dedication',
        unlocked: true,
      });
    }
  }

  const topTrack = stats.topTracks[0];
  if (topTrack && topTrack.playCount >= 50) {
    achievements.push({
      id: 'track-repeater',
      title: 'On Repeat',
      description: `Played "${topTrack.name}" 50+ times`,
      icon: '🔁',
      tier: 'bronze',
      category: 'dedication',
      unlocked: true,
    });
  }

  if (topTrack && topTrack.playCount >= 200) {
    achievements.push({
      id: 'track-obsessed',
      title: 'Song Obsessed',
      description: `Can't stop playing "${topTrack.name}" (200+ plays)`,
      icon: '🎧',
      tier: 'silver',
      category: 'dedication',
      unlocked: true,
    });
  }

  // Special Achievements
  if (stats.averageListeningPerDay >= 180) { // 3 hours per day
    achievements.push({
      id: 'daily-listener',
      title: 'Daily Ritual',
      description: 'Average 3+ hours of music per day',
      icon: '☀️',
      tier: 'gold',
      category: 'special',
      unlocked: true,
    });
  }

  // Calculate listening streak
  const streak = calculateListeningStreak(streamingHistory);
  if (streak >= 7) {
    achievements.push({
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Listened to music for 7 consecutive days',
      icon: '📆',
      tier: 'bronze',
      category: 'special',
      unlocked: true,
    });
  }

  if (streak >= 30) {
    achievements.push({
      id: 'month-streak',
      title: 'Monthly Commitment',
      description: '30-day listening streak!',
      icon: '🔥',
      tier: 'silver',
      category: 'special',
      unlocked: true,
    });
  }

  if (streak >= 100) {
    achievements.push({
      id: 'hundred-streak',
      title: 'Century Streak',
      description: '100 consecutive days of music',
      icon: '💎',
      tier: 'platinum',
      category: 'special',
      unlocked: true,
    });
  }

  // Early Bird / Night Owl
  const hourDistribution = calculateHourDistribution(streamingHistory);
  const morningListening = hourDistribution.filter(h => h.hour >= 5 && h.hour < 9).reduce((sum, h) => sum + h.minutes, 0);
  const nightListening = hourDistribution.filter(h => h.hour >= 22 || h.hour < 2).reduce((sum, h) => sum + h.minutes, 0);
  const totalListeningMinutes = hourDistribution.reduce((sum, h) => sum + h.minutes, 0);

  if (morningListening / totalListeningMinutes > 0.3) {
    achievements.push({
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Most listening happens in the morning',
      icon: '🌅',
      tier: 'silver',
      category: 'special',
      unlocked: true,
    });
  }

  if (nightListening / totalListeningMinutes > 0.3) {
    achievements.push({
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Prefer late-night listening sessions',
      icon: '🌙',
      tier: 'silver',
      category: 'special',
      unlocked: true,
    });
  }

  // Weekend Warrior
  const weekendListening = calculateWeekendListening(streamingHistory);
  if (weekendListening.weekendPercentage > 40) {
    achievements.push({
      id: 'weekend-warrior',
      title: 'Weekend Warrior',
      description: 'Most listening happens on weekends',
      icon: '🎉',
      tier: 'bronze',
      category: 'special',
      unlocked: true,
    });
  }

  return achievements.sort((a, b) => {
    const tierOrder = { diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1 };
    return tierOrder[b.tier] - tierOrder[a.tier];
  });
}

/**
 * Calculate personal records from stats
 */
export function calculatePersonalRecords(
  stats: ProcessedStats,
  streamingHistory: StreamingHistoryEntry[]
): PersonalRecord[] {
  const records: PersonalRecord[] = [];

  // Total listening time
  const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  
  if (totalDays > 0) {
    records.push({
      id: 'total-time',
      title: 'Total Music Time',
      value: `${totalDays} days`,
      description: `That's ${totalHours.toLocaleString()} hours!`,
      icon: 'time',
      category: 'time',
    });
  } else if (totalHours > 0) {
    records.push({
      id: 'total-time',
      title: 'Total Music Time',
      value: `${totalHours} hours`,
      description: `Keep listening to reach a full day!`,
      icon: 'time',
      category: 'time',
    });
  }

  // Longest listening session
  const longestSession = calculateLongestSession(streamingHistory);
  if (longestSession.minutes > 0) {
    records.push({
      id: 'longest-session',
      title: 'Longest Session',
      value: `${longestSession.minutes} min`,
      description: longestSession.date,
      icon: 'time',
      category: 'time',
    });
  }

  // Most active day
  if (stats.mostActiveDay && stats.mostActiveDayMinutes) {
    const date = new Date(stats.mostActiveDay);
    records.push({
      id: 'most-active-day',
      title: 'Most Active Day',
      value: `${stats.mostActiveDayMinutes} min`,
      description: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      icon: 'time',
      category: 'time',
    });
  }

  // Current streak
  const currentStreak = calculateListeningStreak(streamingHistory);
  if (currentStreak > 0) {
    records.push({
      id: 'current-streak',
      title: 'Current Streak',
      value: `${currentStreak} days`,
      description: 'Keep it up!',
      icon: 'streak',
      category: 'streak',
    });
  }

  // Artist variety
  records.push({
    id: 'artist-variety',
    title: 'Artists Explored',
    value: stats.totalArtists.toLocaleString(),
    description: 'Unique artists in your library',
    icon: 'variety',
    category: 'variety',
  });

  // Track variety
  records.push({
    id: 'track-variety',
    title: 'Songs Discovered',
    value: stats.totalTracks.toLocaleString(),
    description: 'Different tracks you\'ve enjoyed',
    icon: 'variety',
    category: 'variety',
  });

  // Top artist dedication
  const topArtist = stats.topArtists[0];
  if (topArtist) {
    const topArtistHours = Math.floor(msToMinutes(topArtist.totalMs) / 60);
    records.push({
      id: 'top-artist-time',
      title: 'Favorite Artist',
      value: topArtist.name,
      description: `${topArtistHours} hours • ${topArtist.playCount.toLocaleString()} plays`,
      icon: 'artist',
      category: 'artist',
    });
  }

  // Top track dedication
  const topTrack = stats.topTracks[0];
  if (topTrack) {
    records.push({
      id: 'top-track-plays',
      title: 'Most Played Song',
      value: topTrack.name,
      description: `${topTrack.playCount.toLocaleString()} plays • ${topTrack.artist}`,
      icon: 'track',
      category: 'track',
    });
  }

  // Average daily listening
  if (stats.averageListeningPerDay > 0) {
    const avgHours = Math.floor(stats.averageListeningPerDay / 60);
    const avgMinutes = Math.floor(stats.averageListeningPerDay % 60);
    const timeStr = avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes} min`;
    
    records.push({
      id: 'daily-average',
      title: 'Daily Average',
      value: timeStr,
      description: 'Your typical music intake',
      icon: 'time',
      category: 'time',
    });
  }

  // Busiest week
  const busiestWeek = calculateBusiestWeek(streamingHistory);
  if (busiestWeek.minutes > 0) {
    records.push({
      id: 'busiest-week',
      title: 'Busiest Week',
      value: `${Math.floor(busiestWeek.minutes)} min`,
      description: busiestWeek.weekStart,
      icon: 'time',
      category: 'time',
    });
  }

  return records;
}

// Helper functions
function calculateListeningStreak(history: StreamingHistoryEntry[]): number {
  if (history.length === 0) return 0;

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
  );

  const uniqueDays = new Set<string>();
  sortedHistory.forEach(entry => {
    const date = new Date(entry.endTime);
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    uniqueDays.add(dayKey);
  });

  const sortedDays = Array.from(uniqueDays).sort().reverse();
  let streak = 0;
  let expectedDate = new Date();

  for (const dayKey of sortedDays) {
    const dayDate = new Date(dayKey);
    const expectedDayKey = `${expectedDate.getFullYear()}-${String(expectedDate.getMonth() + 1).padStart(2, '0')}-${String(expectedDate.getDate()).padStart(2, '0')}`;
    
    if (dayKey === expectedDayKey) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (dayKey < expectedDayKey) {
      const dayDiff = Math.floor((new Date(expectedDayKey).getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        streak++;
        expectedDate = new Date(dayDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return streak;
}

function calculateHourDistribution(history: StreamingHistoryEntry[]): { hour: number; minutes: number }[] {
  const hourMap = new Map<number, number>();
  
  history.forEach(entry => {
    const date = new Date(entry.endTime);
    const hour = date.getHours();
    const minutes = entry.msPlayed / 1000 / 60;
    hourMap.set(hour, (hourMap.get(hour) || 0) + minutes);
  });

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    minutes: hourMap.get(hour) || 0,
  }));
}

function calculateWeekendListening(history: StreamingHistoryEntry[]): { weekendPercentage: number } {
  let weekendMinutes = 0;
  let totalMinutes = 0;

  history.forEach(entry => {
    const date = new Date(entry.endTime);
    const day = date.getDay();
    const minutes = entry.msPlayed / 1000 / 60;
    
    totalMinutes += minutes;
    if (day === 0 || day === 6) {
      weekendMinutes += minutes;
    }
  });

  return {
    weekendPercentage: totalMinutes > 0 ? Math.round((weekendMinutes / totalMinutes) * 100) : 0,
  };
}

function calculateLongestSession(history: StreamingHistoryEntry[]): { minutes: number; date: string } {
  if (history.length === 0) return { minutes: 0, date: '' };

  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
  );

  let maxSession = 0;
  let maxSessionDate = '';
  let currentSession = 0;
  let currentSessionDate = '';
  let lastEndTime: Date | null = null;

  sortedHistory.forEach(entry => {
    const endTime = new Date(entry.endTime);
    
    if (lastEndTime && (endTime.getTime() - lastEndTime.getTime()) / 1000 / 60 > 30) {
      // Gap of more than 30 minutes - new session
      if (currentSession > maxSession) {
        maxSession = currentSession;
        maxSessionDate = currentSessionDate;
      }
      currentSession = entry.msPlayed / 1000 / 60;
      currentSessionDate = endTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else {
      if (!lastEndTime) {
        currentSessionDate = endTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
      currentSession += entry.msPlayed / 1000 / 60;
    }
    
    lastEndTime = endTime;
  });

  if (currentSession > maxSession) {
    maxSession = currentSession;
    maxSessionDate = currentSessionDate;
  }

  return { minutes: Math.floor(maxSession), date: maxSessionDate };
}

function calculateBusiestWeek(history: StreamingHistoryEntry[]): { minutes: number; weekStart: string } {
  const weekMap = new Map<string, number>();

  history.forEach(entry => {
    const date = new Date(entry.endTime);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    const minutes = entry.msPlayed / 1000 / 60;
    
    weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + minutes);
  });

  let maxWeek = 0;
  let maxWeekKey = '';

  weekMap.forEach((minutes, weekKey) => {
    if (minutes > maxWeek) {
      maxWeek = minutes;
      maxWeekKey = weekKey;
    }
  });

  const weekStartDate = maxWeekKey ? new Date(maxWeekKey) : new Date();
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  return {
    minutes: maxWeek,
    weekStart: `${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
  };
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

