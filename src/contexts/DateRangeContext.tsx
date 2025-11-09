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
  resetToCurrentYear: () => void;
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

  const resetToCurrentYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    setStartDate(`${currentYear}-01`);
    setEndDate(`${currentYear}-12`);
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
        resetToCurrentYear,
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

