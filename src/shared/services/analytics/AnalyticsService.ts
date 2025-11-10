/**
 * Analytics Service
 * Handles statistics calculation and analytics processing
 */

import { StreamingHistoryEntry, ProcessedStats } from '@/shared/types';
import { sortArtists, sortTracks } from '@/lib/sorting';

export class AnalyticsService {
  /**
   * Process streaming history and generate statistics
   */
  static processStreamingHistory(
    histories: StreamingHistoryEntry[],
    startDate?: string,
    endDate?: string
  ): Partial<ProcessedStats> {
    // Filter by date range if provided
    let filteredHistories = histories;
    if (startDate || endDate) {
      filteredHistories = histories.filter((entry) => {
        const entryDate = new Date(entry.endTime);
        const entryYearMonth = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;

        if (startDate && entryYearMonth < startDate) return false;
        if (endDate && entryYearMonth > endDate) return false;

        return true;
      });
    }

    const totalMs = filteredHistories.reduce((sum, entry) => sum + entry.msPlayed, 0);

    // Count tracks
    const trackMap = new Map<string, { count: number; artist: string; totalMs: number }>();
    filteredHistories.forEach((entry) => {
      const key = `${entry.trackName}|||${entry.artistName}`;
      const existing = trackMap.get(key);
      if (existing) {
        existing.count++;
        existing.totalMs += entry.msPlayed;
      } else {
        trackMap.set(key, { count: 1, artist: entry.artistName, totalMs: entry.msPlayed });
      }
    });

    // Count artists
    const artistMap = new Map<string, { playCount: number; totalMs: number }>();
    filteredHistories.forEach((entry) => {
      const existing = artistMap.get(entry.artistName);
      if (existing) {
        existing.playCount++;
        existing.totalMs += entry.msPlayed;
      } else {
        artistMap.set(entry.artistName, {
          playCount: 1,
          totalMs: entry.msPlayed,
        });
      }
    });

    // Get top tracks
    const topTracks = sortTracks(
      Array.from(trackMap.entries()).map(([key, value]) => {
        const [name, artist] = key.split('|||');
        return {
          name,
          artist,
          playCount: value.count,
          totalMs: value.totalMs,
        };
      })
    );

    // Get top artists
    const topArtists = sortArtists(
      Array.from(artistMap.entries()).map(([name, value]) => ({
        name,
        playCount: value.playCount,
        totalMs: value.totalMs,
        totalTime: value.totalMs, // Add totalTime for compatibility
      }))
    );

    // Calculate listening by month
    const monthMap = new Map<string, number>();
    filteredHistories.forEach((entry) => {
      const date = new Date(entry.endTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, existing + entry.msPlayed / 1000 / 60); // minutes
    });

    const listeningByMonth = Array.from(monthMap.entries())
      .map(([month, minutes]) => ({ month, minutes: Math.round(minutes) }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate average listening per day
    const uniqueDays = new Set(
      filteredHistories.map((entry) => {
        const date = new Date(entry.endTime);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
    ).size;
    const averageListeningPerDay = totalMs / 1000 / 60 / uniqueDays; // minutes

    // Find most active day
    const dayMap = new Map<string, number>();
    filteredHistories.forEach((entry) => {
      const date = new Date(entry.endTime);
      const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const existing = dayMap.get(day) || 0;
      dayMap.set(day, existing + entry.msPlayed);
    });

    let mostActiveDay = '';
    let mostActiveDayMinutes = 0;
    let maxMs = 0;
    dayMap.forEach((ms, day) => {
      if (ms > maxMs) {
        maxMs = ms;
        mostActiveDay = day;
        mostActiveDayMinutes = Math.round(ms / 1000 / 60); // convert to minutes
      }
    });

    return {
      totalListeningTime: totalMs / 1000 / 60 / 60, // hours
      totalTracks: trackMap.size,
      totalArtists: artistMap.size,
      topArtists,
      topTracks,
      listeningByMonth,
      averageListeningPerDay,
      mostActiveDay,
      mostActiveDayMinutes,
      topArtistName: topArtists[0]?.name,
      topTrackName: topTracks[0]?.name,
    };
  }

  /**
   * Create complete ProcessedStats from filtered histories
   */
  static createStats(
    histories: StreamingHistoryEntry[],
    startDate?: string,
    endDate?: string
  ): ProcessedStats {
    if (histories.length === 0) {
      return this.createEmptyStats();
    }

    const streamingStats = this.processStreamingHistory(histories, startDate, endDate);
    return {
      totalListeningTime: streamingStats.totalListeningTime || 0,
      totalTracks: streamingStats.totalTracks || 0,
      totalArtists: streamingStats.totalArtists || 0,
      topArtistName: streamingStats.topArtistName,
      topTrackName: streamingStats.topTrackName,
      topGenres: streamingStats.topGenres || [],
      listeningByMonth: streamingStats.listeningByMonth || [],
      topArtists: streamingStats.topArtists || [],
      topTracks: streamingStats.topTracks || [],
      averageListeningPerDay: streamingStats.averageListeningPerDay || 0,
      mostActiveDay: streamingStats.mostActiveDay,
      mostActiveDayMinutes: streamingStats.mostActiveDayMinutes,
    };
  }

  /**
   * Create empty stats object
   */
  static createEmptyStats(): ProcessedStats {
    return {
      totalListeningTime: 0,
      totalTracks: 0,
      totalArtists: 0,
      topGenres: [],
      listeningByMonth: [],
      topArtists: [],
      topTracks: [],
      averageListeningPerDay: 0,
    };
  }
}


