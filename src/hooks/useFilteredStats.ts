import { useSpotifyDataContext } from '@/contexts/SpotifyDataContext';
import { ProcessedStats } from '@/types/spotify';

/**
 * Hook to get stats filtered by the current date range
 * Stats are now calculated in the context, so this just returns them
 */
export function useFilteredStats(): ProcessedStats | null {
  const { stats } = useSpotifyDataContext();
  return stats;
}

