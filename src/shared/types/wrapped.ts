/**
 * Wrapped Data Types
 * Types related to Spotify's official Wrapped data format
 */

export interface TopArtist {
  artistUri: string;
}

export interface TopArtistsData {
  numUniqueArtists: number;
  topArtists: TopArtist[];
  topArtistMilliseconds: number;
  topArtistFanPercentage: number;
}

export interface TopPodcastsData {
  topPodcastsUri: string[];
  topPodcastPercentage: number;
  totalPodcastMilliseconds: number;
}

export interface TopTracksData {
  topTracks: string[];
  topTrackPlayCount: number;
  topTrackFirstPlayedDate: string;
  distinctTracksPlayed: number;
}

export interface YearlyMetrics {
  totalMsListened: number;
  mostListenedDay: string;
  mostListenedDayMinutes: number;
  percentGreaterThanWorldwideUsers: number;
}

export interface EraTrack {
  trackName: string;
  trackUri: string;
}

export interface MusicEra {
  key: string;
  peakMonth: number;
  color: string;
  genre: string;
  mood: string;
  descriptor: string;
  pivotalArtists: string[];
  tracks: EraTrack[];
}

export interface MusicEvolution {
  eras: MusicEra[];
}

export interface WrappedData {
  topArtists: TopArtistsData;
  topPodcasts: TopPodcastsData;
  topTracks: TopTracksData;
  yearlyMetrics: YearlyMetrics;
  musicEvolution: MusicEvolution;
}


