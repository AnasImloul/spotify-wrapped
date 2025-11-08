// Type definitions for Spotify Wrapped data

// Standard streaming history format
export interface StreamingHistoryEntry {
  endTime: string;
  artistName: string;
  trackName: string;
  msPlayed: number;
}

// Extended streaming history format
export interface ExtendedStreamingHistoryEntry {
  ts: string;
  platform: string;
  ms_played: number;
  conn_country: string;
  ip_addr: string;
  master_metadata_track_name: string | null;
  master_metadata_album_artist_name: string | null;
  master_metadata_album_album_name: string | null;
  spotify_track_uri: string | null;
  episode_name: string | null;
  episode_show_name: string | null;
  spotify_episode_uri: string | null;
  audiobook_title: string | null;
  audiobook_uri: string | null;
  audiobook_chapter_uri: string | null;
  audiobook_chapter_title: string | null;
  reason_start: string;
  reason_end: string;
  shuffle: boolean;
  skipped: boolean | null;
  offline: boolean;
  offline_timestamp: number;
  incognito_mode: boolean;
}

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

export interface UserData {
  username: string;
  email: string;
  country: string;
  createdFromFacebook: boolean;
  facebookUid?: string;
  birthdate: string;
  gender: string;
  postalCode?: string;
  mobileNumber?: string;
  mobileOperator?: string;
  mobileBrand?: string;
  creationTime: string;
}

// Computed statistics
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

export interface UploadedFile {
  name: string;
  type: 'streaming' | 'extended';
  data: any;
}

