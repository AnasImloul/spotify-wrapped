import { useMemo } from 'react';
import { useSpotifyDataContext } from '@/shared/contexts/SpotifyDataContext';
import { useFilterContext } from '@/features/analytics/contexts/FilterContext';

/**
 * Hook to get tracks sorted by the current sortBy preference
 * Returns tracks with rank included
 */
export function useSortedTracks() {
  const { stats } = useSpotifyDataContext();
  const { sortBy } = useFilterContext();

  return useMemo(() => {
    if (!stats?.topTracks) {
      return [];
    }

    let sorted = [...stats.topTracks];

    if (sortBy === 'plays') {
      sorted = sorted.sort((a, b) => b.playCount - a.playCount);
    } else {
      // Default: sort by time (totalMs)
      sorted = sorted.sort((a, b) => b.totalMs - a.totalMs);
    }

    // Add rank to each track
    return sorted.map((track, index) => ({
      ...track,
      rank: index + 1,
    }));
  }, [stats, sortBy]);
}
