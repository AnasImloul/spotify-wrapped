/**
 * Date Range Popover Component
 * Compact date selector for the header with dropdown functionality
 */

import { useState, useMemo } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { MonthPicker } from './MonthPicker';
import { useDateRange } from '@/shared/hooks';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function DateRangePopover() {
  const [open, setOpen] = useState(false);
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

  // Format date for display (e.g., "Jan '23")
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthName = MONTH_NAMES[parseInt(month) - 1];
    const shortYear = year.slice(2);
    return `${monthName} '${shortYear}`;
  };

  // Get display text for the button
  const displayText = useMemo(() => {
    if (!startDate || !endDate) return 'Select Date Range';

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    // If same month/year, show just once
    if (startDate === endDate) return start;

    return `${start} - ${end}`;
  }, [startDate, endDate]);

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md bg-white/5 border border-white/10
                     hover:bg-white/10 hover:border-white/20 transition-all text-white/80 hover:text-white
                     text-xs sm:text-sm whitespace-nowrap"
        >
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
          <span className="hidden sm:inline font-medium">{displayText}</span>
          <span className="sm:hidden font-medium">Dates</span>
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[320px] sm:w-[380px] bg-slate-900/95 backdrop-blur-xl border-green-500/30 p-4 overflow-visible"
        sideOffset={8}
      >
        <div className="flex flex-col gap-4 overflow-visible">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="font-semibold text-sm">Filter by Date Range</span>
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
                  onClick={resetToFullRange}
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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full overflow-visible">
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

          <p className="text-xs text-white/40 flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-green-400/50 flex-shrink-0 mt-1.5"></span>
            <span>All statistics will be calculated based on the selected date range</span>
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
