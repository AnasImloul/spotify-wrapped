import { useSpotifyDataContext } from '@/contexts/SpotifyDataContext';

/**
 * Hook to access raw Spotify data (files, streaming history, stats)
 */
export function useSpotifyData() {
  const context = useSpotifyDataContext();
  
  return {
    uploadedFiles: context.uploadedFiles,
    streamingHistory: context.streamingHistory,
    stats: context.stats,
    handleFilesProcessed: context.handleFilesProcessed,
    clearData: context.clearData,
  };
}

