import { MonthPicker } from './MonthPicker';
import { useDateRange, useStatsPending } from '@/shared/hooks';
import { useMemo } from 'react';

export function DateRangeSelector() {
  const {
    startDate,
    endDate,
    minDate,
    maxDate,
    setStartDate,
    setEndDate,
    setDateRange,
    resetToFullRange,
  } = useDateRange();
  const isStatsPending = useStatsPending();

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

  const isAllSelected = startDate === minDate && endDate === maxDate;
  const segment = (active: boolean) =>
    `h-8 px-3 text-sm font-medium tabular-nums transition-colors border-r border-input last:border-r-0 ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
    }`;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
      <div className="flex items-center gap-3 min-w-0">
        <span className="label-caps hidden sm:inline shrink-0">Range</span>
        {availableYears.length > 0 && (
          <div
            role="group"
            aria-label="Quick select a year"
            className="flex border border-input overflow-x-auto scrollbar-hide"
          >
            <button
              onClick={resetToFullRange}
              aria-pressed={isAllSelected}
              className={segment(isAllSelected)}
            >
              All years
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => selectYear(year)}
                aria-pressed={isYearSelected(year)}
                className={segment(isYearSelected(year))}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
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

      <p className="text-xs text-muted-foreground lg:ml-auto" aria-live="polite">
        {isStatsPending ? (
          <span className="text-foreground animate-pulse motion-reduce:animate-none">
            Updating to this range…
          </span>
        ) : (
          'Every number on this page uses this range'
        )}
      </p>
    </div>
  );
}
