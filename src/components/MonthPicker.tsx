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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
    <div className="flex-1" ref={dropdownRef}>
      <label className="text-xs text-green-300/80 mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-green-500/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 hover:bg-black/50 hover:border-green-500/30 transition-all duration-200 font-medium text-left flex items-center justify-between"
        >
          <span>{displayValue}</span>
          <ChevronDown className={`w-4 h-4 text-green-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-[#0f0f0f] backdrop-blur-xl border border-green-500/30 rounded-xl shadow-2xl shadow-green-500/10 p-4">
            {/* Year selector */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => handleYearChange(-1)}
                disabled={selectedYear <= minYear}
                className="p-1.5 rounded-lg hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-green-400" />
              </button>
              <span className="text-white font-semibold text-lg">{selectedYear}</span>
              <button
                type="button"
                onClick={() => handleYearChange(1)}
                disabled={selectedYear >= maxYear}
                className="p-1.5 rounded-lg hover:bg-green-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-green-400" />
              </button>
            </div>

            {/* Month grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const monthNum = index + 1;
                const isSelected = monthNum === selectedMonth && selectedYear === parseInt(value.split('-')[0]);
                const isDisabled = isMonthDisabled(monthNum);

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => !isDisabled && handleMonthSelect(monthNum)}
                    disabled={isDisabled}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isSelected 
                        ? 'bg-green-500/30 text-green-300 border border-green-500/50' 
                        : 'text-white/70 hover:bg-green-500/10 hover:text-green-300 border border-transparent'
                      }
                      ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-white/70' : ''}
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

