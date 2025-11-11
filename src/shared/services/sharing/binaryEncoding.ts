import msgpack from 'msgpack-lite';
import pako from 'pako';
import { ProcessedStats } from '@/shared/types';

/**
 * Compact binary representation of shareable analytics data
 * Uses MessagePack for efficient binary encoding (60-70% smaller than JSON)
 */
export interface CompactShareData {
  v: number; // version
  s: [number, number, number, number, number, number, string?, number?]; // stats array
  a: [string, number, number][]; // artists: [name, minutes, plays]
  t: [string, string, number, number][]; // tracks: [name, artist, minutes, plays]
  dr?: [string, string]; // date range: [startDate, endDate] (ISO strings)
}

/**
 * Encode analytics data to a compact binary URL-safe string
 * Uses MessagePack (binary) + Deflate compression + Base64URL
 *
 * Compression comparison:
 * - JSON + Deflate: ~1500-2000 chars
 * - MessagePack + Deflate: ~800-1200 chars (40-50% smaller!)
 */
export function encodeAnalyticsToUrl(
  stats: ProcessedStats,
  topArtists: any[],
  topTracks: any[],
  dateRange?: { startDate: Date; endDate: Date }
): string {
  // Create compact array-based structure (no keys = smaller size)
  const compactData: CompactShareData = {
    v: 2, // Version 2 = MessagePack encoding
    s: [
      Math.round(stats.totalListeningTime * 100) / 100, // total hours
      stats.totalTracks,
      stats.totalArtists,
      stats.totalTracks, // unique tracks
      stats.totalArtists, // unique artists
      Math.round(stats.averageListeningPerDay),
      stats.mostActiveDay,
      stats.mostActiveDayMinutes ? Math.round(stats.mostActiveDayMinutes) : undefined,
    ].filter((x) => x !== undefined) as any,
    a: topArtists.slice(0, 10).map((artist) => [
      artist.name,
      Math.round(artist.totalTime / 60000), // ms to minutes
      artist.playCount,
    ]),
    t: topTracks.slice(0, 10).map((track) => [
      track.name,
      track.artist,
      Math.round(track.totalMs / 60000), // ms to minutes
      track.playCount,
    ]),
    dr: dateRange
      ? [dateRange.startDate.toISOString(), dateRange.endDate.toISOString()]
      : undefined,
  };

  // Encode to MessagePack binary format
  const msgpackBuffer = msgpack.encode(compactData);

  // Compress with Deflate
  const compressed = pako.deflate(msgpackBuffer);

  // Convert to Base64 URL-safe
  const base64 = btoa(String.fromCharCode(...compressed))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64;
}

/**
 * Decode a compact binary URL string back to analytics data
 */
export function decodeAnalyticsFromUrl(encoded: string): CompactShareData | null {
  try {
    // Reverse Base64 URL-safe encoding
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const binaryString = atob(base64 + padding);

    // Convert to Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decompress
    const decompressed = pako.inflate(bytes);

    // Decode MessagePack
    const decoded = msgpack.decode(decompressed);

    return decoded as CompactShareData;
  } catch (error) {
    console.error('Failed to decode analytics from URL:', error);
    return null;
  }
}

/**
 * Generate a shareable URL with compact binary encoding
 */
export function generateCompactShareUrl(encoded: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${encoded}`;
}

/**
 * Convert compact share data back to a readable format
 */
export function expandCompactData(compact: CompactShareData): {
  stats: {
    totalListeningTime: number;
    totalTracks: number;
    totalArtists: number;
    uniqueTracks: number;
    uniqueArtists: number;
    averageListeningPerDay: number;
    mostActiveDay?: string;
    mostActiveDayMinutes?: number;
  };
  topArtists: { name: string; minutes: number; playCount: number }[];
  topTracks: { name: string; artist: string; minutes: number; playCount: number }[];
  dateRange?: { startDate: string; endDate: string };
} {
  const [tt, tc, ta, ut, ua, ad, mpd, mpa] = compact.s;

  return {
    stats: {
      totalListeningTime: tt,
      totalTracks: tc,
      totalArtists: ta,
      uniqueTracks: ut || tc,
      uniqueArtists: ua || ta,
      averageListeningPerDay: ad,
      mostActiveDay: mpd,
      mostActiveDayMinutes: mpa,
    },
    topArtists: compact.a.map(([name, minutes, playCount]) => ({
      name,
      minutes,
      playCount,
    })),
    topTracks: compact.t.map(([name, artist, minutes, playCount]) => ({
      name,
      artist,
      minutes,
      playCount,
    })),
    dateRange: compact.dr ? { startDate: compact.dr[0], endDate: compact.dr[1] } : undefined,
  };
}

/**
 * Get compact analytics data from current URL
 */
/**
 * Get compact data from URL (supports both query param and path param)
 */
export function getCompactDataFromUrl(encodedId?: string): CompactShareData | null {
  // If encoded ID is provided directly, use it
  if (encodedId) {
    return decodeAnalyticsFromUrl(encodedId);
  }

  // Otherwise, check query params for backward compatibility
  const params = new URLSearchParams(window.location.search);
  const shareParam = params.get('share');

  if (!shareParam) return null;

  return decodeAnalyticsFromUrl(shareParam);
}

/**
 * Calculate approximate URL size for the encoded data
 */
export function estimateUrlSize(encoded: string): number {
  const baseUrl = window.location.origin + window.location.pathname;
  return baseUrl.length + '?share='.length + encoded.length;
}

/**
 * Check if the URL is within safe limits (most browsers support ~2000 chars)
 */
export function isUrlSizeSafe(encoded: string, maxSize: number = 2000): boolean {
  return estimateUrlSize(encoded) <= maxSize;
}

/**
 * Generate human-readable summary text from compact data
 */
export function generateSummaryText(compact: CompactShareData): string {
  const expanded = expandCompactData(compact);
  const parts: string[] = [];

  parts.push('My Spotify Wrapped Analytics!');

  if (expanded.stats.totalListeningTime !== undefined) {
    parts.push(
      `I listened for ${Math.round(expanded.stats.totalListeningTime)} hours this period.`
    );
  }

  if (expanded.topArtists.length > 0) {
    parts.push(`My top artist was ${expanded.topArtists[0].name}.`);
  }

  if (expanded.topTracks.length > 0) {
    const topTrack = expanded.topTracks[0];
    parts.push(`My top track was "${topTrack.name}" by ${topTrack.artist}.`);
  }

  if (expanded.stats.uniqueArtists > 0) {
    parts.push(`I discovered ${expanded.stats.uniqueArtists} unique artists.`);
  }

  parts.push('Check out your own stats!');

  return parts.join(' ');
}
