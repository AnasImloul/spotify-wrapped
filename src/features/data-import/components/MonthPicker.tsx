import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  value: string; // Format: "YYYY-MM"
  minDate: string;
  maxDate: string;
  onChange: (value: string) => void;
  label: string;
}

export function MonthPicker({ value, minDate, maxDate, onChange, label }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(parseInt(value.split('-')[0]));
  const [selectedMonth, setSelectedMonth] = useState(parseInt(value.split('-')[1]));
  const dropdownRef = useRef<HTMLDivElement>(null);

  const minYear = parseInt(minDate.split('-')[0]);
  const minMonth = parseInt(minDate.split('-')[1]);
  const maxYear = parseInt(maxDate.split('-')[0]);
  const maxMonth = parseInt(maxDate.split('-')[1]);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync internal state with value prop when it changes externally
  useEffect(() => {
    const [year, month] = value.split('-');
    setSelectedYear(parseInt(year));
    setSelectedMonth(parseInt(month));
  }, [value]);

  const handleMonthSelect = (month: number) => {
    const yearMonthStr = `${selectedYear}-${String(month).padStart(2, '0')}`;
    onChange(yearMonthStr);
    setSelectedMonth(month);
    setIsOpen(false);
  };

  const handleYearChange = (delta: number) => {
    const newYear = selectedYear + delta;
    if (newYear >= minYear && newYear <= maxYear) {
      setSelectedYear(newYear);
    }
  };

  const isMonthDisabled = (month: number) => {
    if (selectedYear === minYear && month < minMonth) return true;
    if (selectedYear === maxYear && month > maxMonth) return true;
    return false;
  };

  const displayValue = `${months[selectedMonth - 1]} ${selectedYear}`;

  return (
    <div className="flex-1 sm:flex-none relative flex items-center gap-2" ref={dropdownRef}>
      <span className="label-caps w-9 sm:w-auto shrink-0">{label}</span>
      <div className="relative overflow-visible flex-1 sm:flex-none">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`${label}: ${displayValue}`}
          aria-expanded={isOpen}
          className="w-full sm:w-44 h-9 px-3 border border-input bg-transparent text-foreground hover:border-foreground transition-colors text-sm font-medium text-left flex items-center justify-between gap-2"
        >
          <span className="whitespace-nowrap overflow-hidden text-ellipsis">{displayValue}</span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-[9999] mt-1 w-full min-w-[15rem] bg-popover border border-border shadow-[0_16px_40px_rgba(0,0,0,0.55)] p-3">
            {/* Year selector */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => handleYearChange(-1)}
                disabled={selectedYear <= minYear}
                aria-label="Previous year"
                className="p-1.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-base tabular-nums">{selectedYear}</span>
              <button
                type="button"
                onClick={() => handleYearChange(1)}
                disabled={selectedYear >= maxYear}
                aria-label="Next year"
                className="p-1.5 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-1">
              {months.map((month, index) => {
                const monthNum = index + 1;
                const isSelected =
                  monthNum === selectedMonth && selectedYear === parseInt(value.split('-')[0]);
                const isDisabled = isMonthDisabled(monthNum);

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => !isDisabled && handleMonthSelect(monthNum)}
                    disabled={isDisabled}
                    className={`
                      px-3 py-2 text-sm font-medium transition-colors
                      ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }
                      ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground' : ''}
                    `}
                  >
                    {month.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
