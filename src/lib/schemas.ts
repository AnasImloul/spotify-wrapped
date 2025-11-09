import { z } from 'zod';

/**
 * Schema for Standard Spotify streaming history format
 * Found in: StreamingHistory_music_*.json
 */
export const StandardStreamingHistorySchema = z.object({
  endTime: z.string(),
  artistName: z.string(),
  trackName: z.string(),
  msPlayed: z.number(),
});

/**
 * Schema for Extended Spotify streaming history format
 * Found in: Streaming_History_Audio_*.json
 */
export const ExtendedStreamingHistorySchema = z.object({
  ts: z.string(),
  platform: z.string().optional(),
  ms_played: z.number(),
  conn_country: z.string().optional(),
  ip_addr: z.string().optional(),
  master_metadata_track_name: z.string().nullable(),
  master_metadata_album_artist_name: z.string().nullable(),
  master_metadata_album_album_name: z.string().nullable().optional(),
  spotify_track_uri: z.string().nullable().optional(),
  episode_name: z.string().nullable().optional(),
  episode_show_name: z.string().nullable().optional(),
  spotify_episode_uri: z.string().nullable().optional(),
  audiobook_title: z.string().nullable().optional(),
  audiobook_uri: z.string().nullable().optional(),
  audiobook_chapter_uri: z.string().nullable().optional(),
  audiobook_chapter_title: z.string().nullable().optional(),
  reason_start: z.string().optional(),
  reason_end: z.string().optional(),
  shuffle: z.boolean().optional(),
  skipped: z.boolean().nullable().optional(),
  offline: z.boolean().optional(),
  offline_timestamp: z.number().optional(),
  incognito_mode: z.boolean().optional(),
});

// Array schemas for validation
export const StandardStreamingHistoryArraySchema = z.array(StandardStreamingHistorySchema);
export const ExtendedStreamingHistoryArraySchema = z.array(ExtendedStreamingHistorySchema);

// Infer types from schemas
export type StandardStreamingHistory = z.infer<typeof StandardStreamingHistorySchema>;
export type ExtendedStreamingHistory = z.infer<typeof ExtendedStreamingHistorySchema>;

/**
 * Detect file type by validating against schemas
 * Validates ALL entries in the array for complete type safety
 * Returns the detected type and whether validation was successful
 */
export function detectFileTypeBySchema(
  data: unknown
): { type: 'streaming' | 'extended' | 'unknown'; isValid: boolean; error?: string } {
  if (!Array.isArray(data) || data.length === 0) {
    return { type: 'unknown', isValid: false, error: 'Data is not a non-empty array' };
  }

  // Try to validate ALL entries against standard format for complete type safety
  const standardResult = StandardStreamingHistoryArraySchema.safeParse(data);
  if (standardResult.success) {
    return { type: 'streaming', isValid: true };
  }

  // Try to validate ALL entries against extended format
  const extendedResult = ExtendedStreamingHistoryArraySchema.safeParse(data);
  if (extendedResult.success) {
    return { type: 'extended', isValid: true };
  }

  // If neither format matched, return unknown
  const errors = [
    standardResult.success ? null : standardResult.error.issues[0]?.message,
    extendedResult.success ? null : extendedResult.error.issues[0]?.message,
  ].filter(Boolean);

  return { 
    type: 'unknown', 
    isValid: false, 
    error: `File format not recognized. Expected standard or extended streaming history. Errors: ${errors.join(', ')}` 
  };
}

/**
 * Validate entire array against detected schema
 */
export function validateStreamingHistoryArray(
  data: unknown,
  type: 'streaming' | 'extended'
): { isValid: boolean; error?: string; validEntries?: number } {
  try {
    if (type === 'streaming') {
      const result = StandardStreamingHistoryArraySchema.safeParse(data);
      if (result.success) {
        return { isValid: true, validEntries: result.data.length };
      }
      return { 
        isValid: false, 
        error: `Invalid standard streaming history: ${result.error.issues[0]?.message}` 
      };
    } else {
      const result = ExtendedStreamingHistoryArraySchema.safeParse(data);
      if (result.success) {
        return { isValid: true, validEntries: result.data.length };
      }
      return { 
        isValid: false, 
        error: `Invalid extended streaming history: ${result.error.issues[0]?.message}` 
      };
    }
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown validation error' 
    };
  }
}

