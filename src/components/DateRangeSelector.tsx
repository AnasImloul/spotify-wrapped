import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { MonthPicker } from './MonthPicker';
import { useDateRange } from '@/hooks';

export function DateRangeSelector() {
  const { startDate, endDate, minDate, maxDate, setStartDate, setEndDate, resetToCurrentYear } = useDateRange();
  return (
    <Card className="border-green-500/30 bg-black/40 overflow-visible relative z-10">
      <CardContent className="p-4 sm:p-6 overflow-visible">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Filter by Date Range:</span>
          </div>
          
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

          <button
            onClick={resetToCurrentYear}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-300 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-green-600/30 hover:border-green-500/40 transition-all duration-200 text-sm font-medium shadow-lg shadow-green-500/10"
          >
            Reset to Full Range
          </button>
        </div>
        
        <p className="text-xs text-white/40 mt-4 flex items-start sm:items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-green-400/50 flex-shrink-0 mt-1.5 sm:mt-0"></span>
          <span>All statistics will be calculated based on the selected date range</span>
        </p>
      </CardContent>
    </Card>
  );
}

