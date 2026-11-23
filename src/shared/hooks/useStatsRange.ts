import { useSpotifyDataContext } from '@/shared/contexts/SpotifyDataContext';

export { useStatsPending } from '@/shared/contexts/SpotifyDataContext';

/**
 * The date range the currently displayed stats were computed for. Heavy views
 * read this instead of the live picker value, so a range click never blocks
 * the click itself; they update when the new stats land.
 */
export function useStatsRange() {
  return useSpotifyDataContext().statsRange;
}
