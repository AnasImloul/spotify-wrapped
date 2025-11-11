import { useMemo } from 'react';
import { useSpotifyDataContext } from '@/shared/contexts/SpotifyDataContext';
import { useFilterContext } from '@/features/analytics/contexts/FilterContext';

/**
 * Hook to get artists sorted by the current sortBy preference
 * Returns artists with rank included
 */
export function useSortedArtists() {
  const { stats } = useSpotifyDataContext();
  const { sortBy } = useFilterContext();

  return useMemo(() => {
    if (!stats?.topArtists) {
      return [];
    }

    let sorted = [...stats.topArtists];

    if (sortBy === 'plays') {
      sorted = sorted.sort((a, b) => b.playCount - a.playCount);
    } else {
      // Default: sort by time (totalMs)
      sorted = sorted.sort((a, b) => b.totalMs - a.totalMs);
    }

    // Add rank to each artist
    return sorted.map((artist, index) => ({
      ...artist,
      rank: index + 1,
    }));
  }, [stats, sortBy]);
}
