import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { MonthPicker } from './MonthPicker';
import { useDateRange } from '@/hooks';
import { useMemo } from 'react';

export function DateRangeSelector() {
  const { startDate, endDate, minDate, maxDate, setStartDate, setEndDate, setDateRange, resetToCurrentYear } = useDateRange();
  
  // Get available years from the data range
  const availableYears = useMemo(() => {
    if (!minDate || !maxDate) return [];
    
    const minYear = parseInt(minDate.split('-')[0]);
    const maxYear = parseInt(maxDate.split('-')[0]);
    
    const years: number[] = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  }, [minDate, maxDate]);
  
  const selectYear = (year: number) => {
    // Clamp to actual data boundaries for the selected year
    const yearStart = `${year}-01`;
    const yearEnd = `${year}-12`;
    
    // Ensure we don't go outside the actual data range
    const clampedStart = yearStart < minDate ? minDate : yearStart;
    const clampedEnd = yearEnd > maxDate ? maxDate : yearEnd;
    
    // Use setDateRange to batch both state updates together
    setDateRange(clampedStart, clampedEnd);
  };
  
  // Check if a specific year is currently selected
  const isYearSelected = (year: number) => {
    // Get what the clamped dates would be for this year
    const yearStart = `${year}-01`;
    const yearEnd = `${year}-12`;
    const clampedStart = yearStart < minDate ? minDate : yearStart;
    const clampedEnd = yearEnd > maxDate ? maxDate : yearEnd;
    
    // Check if current selection matches the clamped year range
    return startDate === clampedStart && endDate === clampedEnd;
  };
  
  return (
    <Card className="border-green-500/30 bg-black/40 overflow-visible relative z-10">
      <CardContent className="p-4 sm:p-6 overflow-visible">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Filter by Date Range:</span>
          </div>
          
          {/* Year shortcuts */}
          {availableYears.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-white/60">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isYearSelected(year)
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-400 shadow-lg shadow-green-500/20'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {year}
                  </button>
                ))}
                <button
                  onClick={resetToCurrentYear}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    startDate === minDate && endDate === maxDate
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-400 shadow-lg shadow-green-500/20'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  All Years
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
            <MonthPicker
              value={startDate}
              minDate={minDate}
              maxDate={maxDate}
              onChange={setStartDate}
              label="From"
            />
            
            <MonthPicker
              value={endDate}
              minDate={minDate}
              maxDate={maxDate}
              onChange={setEndDate}
              label="To"
            />
          </div>
        </div>
        
        <p className="text-xs text-white/40 mt-4 flex items-start sm:items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-green-400/50 flex-shrink-0 mt-1.5 sm:mt-0"></span>
          <span>All statistics will be calculated based on the selected date range</span>
        </p>
      </CardContent>
    </Card>
  );
}

