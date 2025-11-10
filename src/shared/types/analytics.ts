/**
 * Analytics Types
 * Types related to computed statistics and analytics
 */

import { MusicEvolution, YearlyMetrics } from './wrapped';

export interface ProcessedStats {
  totalListeningTime: number; // in hours
  totalTracks: number;
  totalArtists: number;
  topArtistName?: string;
  topTrackName?: string;
  topGenres: { genre: string; count: number }[];
  listeningByMonth: { month: string; minutes: number }[];
  topArtists: { name: string; playCount: number; totalMs: number; totalTime: number }[];
  topTracks: { name: string; artist: string; playCount: number; totalMs: number }[];
  averageListeningPerDay: number;
  mostActiveDay?: string;
  mostActiveDayMinutes?: number;
  musicEvolution?: MusicEvolution;
  yearlyMetrics?: YearlyMetrics;
}

export interface TopArtist {
  name: string;
  playCount: number;
  totalMs: number;
  totalTime: number;
}

export interface TopTrack {
  name: string;
  artist: string;
  playCount: number;
  totalMs: number;
}

export interface GenreData {
  genre: string;
  count: number;
}

export interface MonthlyData {
  month: string;
  minutes: number;
}


