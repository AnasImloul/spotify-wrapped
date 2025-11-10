import { useSpotifyDataContext } from '@/shared/contexts/SpotifyDataContext';

/**
 * Hook to access raw Spotify data (files, streaming history, stats)
 */
export function useSpotifyData() {
  const context = useSpotifyDataContext();
  
  return {
    uploadedFiles: context.uploadedFiles,
    streamingHistory: context.streamingHistory,
    stats: context.stats,
    isProcessing: context.isProcessing,
    handleFilesProcessed: context.handleFilesProcessed,
    clearData: context.clearData,
  };
}

