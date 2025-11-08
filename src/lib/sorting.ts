/**
 * Centralized sorting utilities for artists and tracks
 */

export interface Artist {
  name: string;
  playCount: number;
  totalTime: number;
  totalMs: number;
  rank?: number;
}

export interface Track {
  name: string;
  artist: string;
  playCount: number;
  totalMs: number;
  rank?: number;
}

/**
 * Sort artists by total listening time (descending)
 */
export function sortArtistsByTime(artists: Artist[]): Artist[] {
  return [...artists].sort((a, b) => b.totalTime - a.totalTime);
}

/**
 * Sort artists by play count (descending)
 */
export function sortArtistsByPlays(artists: Artist[]): Artist[] {
  return [...artists].sort((a, b) => b.playCount - a.playCount);
}

/**
 * Sort tracks by total listening time (descending)
 */
export function sortTracksByTime(tracks: Track[]): Track[] {
  return [...tracks].sort((a, b) => b.totalMs - a.totalMs);
}

/**
 * Sort tracks by play count (descending)
 */
export function sortTracksByPlays(tracks: Track[]): Track[] {
  return [...tracks].sort((a, b) => b.playCount - a.playCount);
}

/**
 * Default sorting strategy: by listening time
 * This ensures consistency across the app
 */
export function sortArtists(artists: Artist[]): Artist[] {
  return sortArtistsByTime(artists);
}

export function sortTracks(tracks: Track[]): Track[] {
  return sortTracksByTime(tracks);
}

