import { createContext, useContext, useState, ReactNode } from 'react';
import { UploadedFile } from '@/types/spotify';
import { getDateRangeFromFiles } from '@/lib/dataProcessor';

interface DateRangeContextType {
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDateRange: (start: string, end: string) => void;
  resetToCurrentYear: () => void;
  resetToFullRange: () => void;
  updateDateRangeFromFiles: (files: UploadedFile[]) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

interface DateRangeProviderProps {
  children: ReactNode;
}

export function DateRangeProvider({ children }: DateRangeProviderProps) {
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12`);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  // Batch update both dates at once to avoid double re-render
  const setDateRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const resetToCurrentYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentYearStart = `${currentYear}-01`;
    const currentYearEnd = `${currentYear}-12`;
    
    // If current year is within the data range, use it (with clamping)
    // Otherwise, reset to the full data range
    if (minDate && maxDate) {
      const minYear = parseInt(minDate.split('-')[0]);
      const maxYear = parseInt(maxDate.split('-')[0]);
      
      if (currentYear >= minYear && currentYear <= maxYear) {
        // Current year is within data range, but clamp to actual data boundaries
        const clampedStart = currentYearStart < minDate ? minDate : currentYearStart;
        const clampedEnd = currentYearEnd > maxDate ? maxDate : currentYearEnd;
        setStartDate(clampedStart);
        setEndDate(clampedEnd);
      } else {
        // Current year is outside data range, reset to full range
        setStartDate(minDate);
        setEndDate(maxDate);
      }
    } else {
      // No data loaded yet, use current year
      setStartDate(currentYearStart);
      setEndDate(currentYearEnd);
    }
  };

  const resetToFullRange = () => {
    // Always reset to the full data range
    if (minDate && maxDate) {
      setStartDate(minDate);
      setEndDate(maxDate);
    }
  };

  const updateDateRangeFromFiles = (files: UploadedFile[]) => {
    if (files.length === 0) {
      setMinDate('');
      setMaxDate('');
      return;
    }

    // Get date range from files
    const { min, max } = getDateRangeFromFiles(files);
    setMinDate(min);
    setMaxDate(max);

    // If current date range is outside the data range, adjust it
    if (min && max) {
      setStartDate((currentStart) => {
        if (currentStart < min || currentStart > max) {
          return min;
        }
        return currentStart;
      });
      
      setEndDate((currentEnd) => {
        if (currentEnd > max || currentEnd < min) {
          return max;
        }
        return currentEnd;
      });
    }
  };

  return (
    <DateRangeContext.Provider
      value={{
        startDate,
        endDate,
        minDate,
        maxDate,
        setStartDate,
        setEndDate,
        setDateRange,
        resetToCurrentYear,
        resetToFullRange,
        updateDateRangeFromFiles,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRangeContext() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRangeContext must be used within a DateRangeProvider');
  }
  return context;
}

