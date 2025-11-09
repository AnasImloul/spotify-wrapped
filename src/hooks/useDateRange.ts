import { useDateRangeContext } from '@/contexts/DateRangeContext';

/**
 * Hook to access and modify date range settings
 */
export function useDateRange() {
  const context = useDateRangeContext();
  
  return {
    startDate: context.startDate,
    endDate: context.endDate,
    minDate: context.minDate,
    maxDate: context.maxDate,
    setStartDate: context.setStartDate,
    setEndDate: context.setEndDate,
    setDateRange: context.setDateRange,
    resetToCurrentYear: context.resetToCurrentYear,
    updateDateRangeFromFiles: context.updateDateRangeFromFiles,
  };
}

