import pako from 'pako';
import type { ProcessedStats } from '@/types/spotify';

/**
 * Shareable data structure (minimal footprint)
 */
export interface ShareableData {
  v: number; // version
  s: {
    // stats
    tt: number; // totalListeningTime (hours)
    tc: number; // totalTracks
    ta: number; // totalArtists
    ut: number; // uniqueTracks (totalTracks in context)
    ua: number; // uniqueArtists (totalArtists in context)
    ad: number; // averageListeningPerDay (minutes)
    mpd?: string; // mostProductiveDay (YYYY-MM-DD)
    mpa?: number; // mostProductiveDayMinutes
  };
  a?: Array<{
    // top 10 artists
    n: string; // name
    m: number; // minutes
    p: number; // playCount
  }>;
  t?: Array<{
    // top 10 tracks
    n: string; // track name
    a: string; // artist
    m: number; // minutes
    p: number; // playCount
  }>;
  dr?: {
    // date range
    s: string; // start (YYYY-MM-DD)
    e: string; // end (YYYY-MM-DD)
  };
}

/**
 * Compress and encode data to base64 URL-safe string
 */
export function encodeDataToUrl(stats: ProcessedStats, topArtists: any[], topTracks: any[]): string {
  const shareableData: ShareableData = {
    v: 1,
    s: {
      tt: Math.round(stats.totalListeningTime * 100) / 100, // 2 decimals
      tc: stats.totalTracks,
      ta: stats.totalArtists,
      ut: stats.totalTracks,
      ua: stats.totalArtists,
      ad: Math.round(stats.averageListeningPerDay),
      mpd: stats.mostActiveDay,
      mpa: stats.mostActiveDayMinutes
        ? Math.round(stats.mostActiveDayMinutes)
        : undefined,
    },
    a: topArtists.slice(0, 10).map((artist) => ({
      n: artist.name,
      m: Math.round(artist.totalTime / 60000), // Convert totalTime (ms) to minutes
      p: artist.playCount,
    })),
    t: topTracks.slice(0, 10).map((track) => ({
      n: track.name,
      a: track.artist,
      m: Math.round(track.totalMs / 60000), // Convert ms to minutes
      p: track.playCount,
    })),
    dr: undefined, // No date range in ProcessedStats
  };

  // Convert to JSON
  const jsonString = JSON.stringify(shareableData);

  // Compress with pako
  const compressed = pako.deflate(jsonString);

  // Convert to base64 URL-safe
  const base64 = btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}

/**
 * Decode and decompress URL data
 */
export function decodeDataFromUrl(encodedData: string): ShareableData | null {
  try {
    // Convert from URL-safe base64
    const base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');

    // Pad if necessary
    const padded = base64 + '==='.slice((base64.length + 3) % 4);

    // Decode base64
    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress
    const decompressed = pako.inflate(bytes, { to: 'string' });

    // Parse JSON
    const data = JSON.parse(decompressed) as ShareableData;

    // Validate version
    if (data.v !== 1) {
      console.warn('Unsupported data version:', data.v);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to decode URL data:', error);
    return null;
  }
}

/**
 * Convert ShareableData back to ProcessedStats format
 */
export function shareableDataToStats(data: ShareableData): Partial<ProcessedStats> {
  return {
    totalListeningTime: data.s.tt,
    totalTracks: data.s.tc,
    totalArtists: data.s.ta,
    averageListeningPerDay: data.s.ad,
    mostActiveDay: data.s.mpd,
    mostActiveDayMinutes: data.s.mpa,
    topGenres: [],
    listeningByMonth: [],
    topArtists: [],
    topTracks: [],
  };
}

/**
 * Generate shareable URL with encoded data
 */
export function generateShareableUrl(
  stats: ProcessedStats,
  topArtists: any[],
  topTracks: any[]
): { url: string; size: number; encoded: string } {
  const encoded = encodeDataToUrl(stats, topArtists, topTracks);
  const baseUrl = window.location.origin + window.location.pathname;
  const url = `${baseUrl}?share=${encoded}`;

  return {
    url,
    size: url.length,
    encoded,
  };
}

/**
 * Check if URL is within safe size limits (most browsers support ~2000 chars)
 */
export function isUrlSizeSafe(url: string): boolean {
  return url.length <= 2000;
}

/**
 * Get URL share data from current location
 */
export function getSharedDataFromUrl(): ShareableData | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('share');

  if (!encoded) {
    return null;
  }

  return decodeDataFromUrl(encoded);
}

/**
 * Clear share parameter from URL without reload
 */
export function clearShareFromUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('share');
  window.history.replaceState({}, '', url.toString());
}

/**
 * Generate shareable stats summary for URL sharing
 */
export function generateUrlShareText(data: ShareableData): string {
  const lines: string[] = ['🎵 Check out my Spotify Wrapped Analytics!'];

  lines.push(`⏱️ ${Math.round(data.s.tt)}h of music`);
  lines.push(`🎨 ${data.s.ua.toLocaleString()} artists explored`);
  lines.push(`💿 ${data.s.ut.toLocaleString()} tracks played`);

  if (data.a && data.a.length > 0) {
    lines.push(`🎤 Top Artist: ${data.a[0].n}`);
  }

  if (data.t && data.t.length > 0) {
    lines.push(`🎧 Top Track: ${data.t[0].n} - ${data.t[0].a}`);
  }

  return lines.join('\n');
}

