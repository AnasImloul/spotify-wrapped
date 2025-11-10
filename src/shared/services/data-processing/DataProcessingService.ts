/**
 * Data Processing Service
 * Handles file parsing, validation, and transformation of Spotify data
 */

import {
  StreamingHistoryEntry,
  ExtendedStreamingHistoryEntry,
  UploadedFile,
} from '@/shared/types';
import { detectFileTypeBySchema } from '@/lib/schemas';

export class DataProcessingService {
  /**
   * Convert extended streaming history to standard format
   */
  static convertExtendedToStandard(
    extended: ExtendedStreamingHistoryEntry
  ): StreamingHistoryEntry | null {
    // Filter out non-music content (podcasts, audiobooks, videos)
    if (
      !extended.master_metadata_track_name ||
      !extended.master_metadata_album_artist_name ||
      extended.episode_name ||
      extended.audiobook_title
    ) {
      return null;
    }

    return {
      endTime: extended.ts,
      artistName: extended.master_metadata_album_artist_name,
      trackName: extended.master_metadata_track_name,
      msPlayed: extended.ms_played,
    };
  }

  /**
   * Detect file type using Zod schema validation with filename fallback
   */
  static detectFileType(fileName: string, data: any): 'streaming' | 'extended' {
    // First, try schema-based detection (most reliable)
    const schemaResult = detectFileTypeBySchema(data);

    if (schemaResult.isValid && schemaResult.type !== 'unknown') {
      console.log(`✓ Detected ${schemaResult.type} format via schema validation for ${fileName}`);
      return schemaResult.type;
    }

    // Fallback to filename pattern matching (for edge cases)
    console.warn(`⚠ Schema validation failed for ${fileName}, falling back to filename pattern matching`);
    console.warn(`Schema error: ${schemaResult.error}`);

    // Check for extended streaming history by filename pattern
    if (fileName.match(/Streaming_History_Audio_.*\.json/i)) {
      console.log(`Detected extended format via filename for ${fileName}`);
      return 'extended';
    }

    // Check for standard streaming history
    if (fileName.match(/StreamingHistory_music_\d+\.json/i)) {
      console.log(`Detected streaming format via filename for ${fileName}`);
      return 'streaming';
    }

    // Last resort: basic structure check
    if (Array.isArray(data) && data.length > 0) {
      // Check for extended format
      if (data[0]?.ts && data[0]?.master_metadata_track_name !== undefined) {
        console.log(`Detected extended format via structure check for ${fileName}`);
        return 'extended';
      }
      // Check for standard format
      if (data[0]?.endTime && data[0]?.artistName) {
        console.log(`Detected streaming format via structure check for ${fileName}`);
        return 'streaming';
      }
    }

    // Default to streaming if can't determine
    console.warn(`⚠ Could not definitively detect format for ${fileName}, defaulting to 'streaming'`);
    return 'streaming';
  }

  /**
   * Extract streaming history from uploaded files
   */
  static getStreamingHistoryFromFiles(files: UploadedFile[]): StreamingHistoryEntry[] {
    const streamingHistories: StreamingHistoryEntry[] = [];

    files.forEach((file) => {
      if (file.type === 'streaming' && Array.isArray(file.data)) {
        streamingHistories.push(...(file.data as StreamingHistoryEntry[]));
      } else if (file.type === 'extended' && Array.isArray(file.data)) {
        const converted = file.data
          .map((entry: ExtendedStreamingHistoryEntry) => this.convertExtendedToStandard(entry))
          .filter((entry): entry is StreamingHistoryEntry => entry !== null);
        streamingHistories.push(...converted);
      }
    });

    return streamingHistories;
  }

  /**
   * Get date range from uploaded files
   */
  static getDateRangeFromFiles(files: UploadedFile[]): { min: string; max: string } {
    let minDate = '';
    let maxDate = '';

    files.forEach((file) => {
      if (file.type === 'streaming' && Array.isArray(file.data)) {
        file.data.forEach((entry: StreamingHistoryEntry) => {
          const date = new Date(entry.endTime);
          const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

          if (!minDate || yearMonth < minDate) {
            minDate = yearMonth;
          }
          if (!maxDate || yearMonth > maxDate) {
            maxDate = yearMonth;
          }
        });
      } else if (file.type === 'extended' && Array.isArray(file.data)) {
        file.data.forEach((entry: ExtendedStreamingHistoryEntry) => {
          const converted = this.convertExtendedToStandard(entry);
          if (converted) {
            const date = new Date(converted.endTime);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!minDate || yearMonth < minDate) {
              minDate = yearMonth;
            }
            if (!maxDate || yearMonth > maxDate) {
              maxDate = yearMonth;
            }
          }
        });
      }
    });

    return { min: minDate, max: maxDate };
  }
}

