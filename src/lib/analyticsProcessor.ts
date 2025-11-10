import { StreamingHistoryEntry } from '@/shared/types';

/**
 * Heatmap data structure: [dayOfWeek][hour] = minutes
 * dayOfWeek: 0 (Sunday) to 6 (Saturday)
 * hour: 0 to 23
 */
export interface HeatmapData {
  data: number[][]; // 7 days × 24 hours (total minutes)
  counts: number[][]; // 7 days × 24 hours (occurrence count)
  maxValue: number;
}

/**
 * Monthly trend data point
 */
export interface MonthlyDataPoint {
  month: string; // YYYY-MM format
  minutes: number;
  hours: number;
  trackCount: number;
}

/**
 * Listening patterns analysis
 */
export interface ListeningPatterns {
  weekdayMinutes: number;
  weekendMinutes: number;
  weekdayCount: number; // Number of actual weekdays in the data
  weekendCount: number; // Number of actual weekend days in the data
  weekdayPercentage: number;
  weekendPercentage: number;
  dayMinutes: number; // 6 AM - 6 PM
  nightMinutes: number; // 6 PM - 6 AM
  dayCount: number; // Number of unique days with listening
  dayPercentage: number;
  nightPercentage: number;
  morningMinutes: number; // 6 AM - 12 PM
  afternoonMinutes: number; // 12 PM - 6 PM
  eveningMinutes: number; // 6 PM - 12 AM
  lateNightMinutes: number; // 12 AM - 6 AM
}

/**
 * Generate heatmap data from streaming history
 */
export function generateHeatmap(history: StreamingHistoryEntry[]): HeatmapData {
  // Initialize 7x24 matrix (days × hours)
  const heatmap: number[][] = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => 0)
  );
  const counts: number[][] = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => 0)
  );

  // Track unique dates for each day/hour combination
  const uniqueDates = Array.from({ length: 7 }, () => 
    Array.from({ length: 24 }, () => new Set<string>())
  );

  // Aggregate listening time by day of week and hour
  history.forEach((entry) => {
    const date = new Date(entry.endTime);
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const hour = date.getHours(); // 0 to 23
    const minutes = entry.msPlayed / 1000 / 60;
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    heatmap[dayOfWeek][hour] += minutes;
    uniqueDates[dayOfWeek][hour].add(dateKey);
  });

  // Convert unique dates to counts
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      counts[day][hour] = uniqueDates[day][hour].size;
    }
  }

  // Find max value for normalization
  const maxValue = Math.max(...heatmap.flat());

  return {
    data: heatmap,
    counts,
    maxValue,
  };
}

/**
 * Generate monthly trends from streaming history
 */
export function generateMonthlyTrends(history: StreamingHistoryEntry[]): MonthlyDataPoint[] {
  const monthlyData = new Map<string, { minutes: number; trackCount: number }>();

  // Aggregate by month
  history.forEach((entry) => {
    const date = new Date(entry.endTime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const minutes = entry.msPlayed / 1000 / 60;

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { minutes: 0, trackCount: 0 });
    }

    const data = monthlyData.get(monthKey)!;
    data.minutes += minutes;
    data.trackCount += 1;
  });

  // Convert to array and sort by month
  const trends = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      minutes: Math.round(data.minutes),
      hours: Math.round(data.minutes / 60),
      trackCount: data.trackCount,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return trends;
}

/**
 * Analyze listening patterns (weekday vs weekend, day vs night)
 */
export function analyzeListeningPatterns(history: StreamingHistoryEntry[]): ListeningPatterns {
  let weekdayMinutes = 0;
  let weekendMinutes = 0;
  let morningMinutes = 0; // 6 AM - 12 PM
  let afternoonMinutes = 0; // 12 PM - 6 PM
  let eveningMinutes = 0; // 6 PM - 12 AM
  let lateNightMinutes = 0; // 12 AM - 6 AM

  // Track unique dates for weekdays and weekends
  const uniqueWeekdays = new Set<string>();
  const uniqueWeekendDays = new Set<string>();
  // Track unique dates overall for day/night average calculation
  const uniqueDays = new Set<string>();

  history.forEach((entry) => {
    const date = new Date(entry.endTime);
    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    const minutes = entry.msPlayed / 1000 / 60;
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Track unique days overall
    uniqueDays.add(dateKey);

    // Weekday vs Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendMinutes += minutes;
      uniqueWeekendDays.add(dateKey);
    } else {
      weekdayMinutes += minutes;
      uniqueWeekdays.add(dateKey);
    }

    // Time of day
    if (hour >= 6 && hour < 12) {
      morningMinutes += minutes;
    } else if (hour >= 12 && hour < 18) {
      afternoonMinutes += minutes;
    } else if (hour >= 18 && hour < 24) {
      eveningMinutes += minutes;
    } else {
      lateNightMinutes += minutes;
    }
  });

  const totalMinutes = weekdayMinutes + weekendMinutes;
  const dayMinutes = morningMinutes + afternoonMinutes;
  const nightMinutes = eveningMinutes + lateNightMinutes;

  return {
    weekdayMinutes: Math.round(weekdayMinutes),
    weekendMinutes: Math.round(weekendMinutes),
    weekdayCount: uniqueWeekdays.size,
    weekendCount: uniqueWeekendDays.size,
    weekdayPercentage: Math.round((weekdayMinutes / totalMinutes) * 100),
    weekendPercentage: Math.round((weekendMinutes / totalMinutes) * 100),
    dayMinutes: Math.round(dayMinutes),
    nightMinutes: Math.round(nightMinutes),
    dayCount: uniqueDays.size,
    dayPercentage: Math.round((dayMinutes / totalMinutes) * 100),
    nightPercentage: Math.round((nightMinutes / totalMinutes) * 100),
    morningMinutes: Math.round(morningMinutes),
    afternoonMinutes: Math.round(afternoonMinutes),
    eveningMinutes: Math.round(eveningMinutes),
    lateNightMinutes: Math.round(lateNightMinutes),
  };
}

