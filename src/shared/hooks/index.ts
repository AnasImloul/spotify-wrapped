/**
 * Shared Hooks Barrel Export
 * Global hooks available across all features
 */

export * from './useSpotifyData';
export * from './useDateRange';
export * from './useAnimatedNumber';
export * from './useSwipeNavigation';

// Re-export feature hooks for convenience (these are in their feature folders)
export { useFilteredStats } from '@/features/analytics/hooks/useFilteredStats';
export { useSortedArtists } from '@/features/analytics/hooks/useSortedArtists';
export { useSortedTracks } from '@/features/analytics/hooks/useSortedTracks';
export { useStoryData } from '@/features/story-mode/hooks/useStoryData';

