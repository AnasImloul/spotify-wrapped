import { useFilterContext } from '@/contexts/FilterContext';

/**
 * Hook to access and modify filter settings (sortBy)
 */
export function useFilterSettings() {
  const context = useFilterContext();
  
  return {
    sortBy: context.sortBy,
    setSortBy: context.setSortBy,
  };
}

