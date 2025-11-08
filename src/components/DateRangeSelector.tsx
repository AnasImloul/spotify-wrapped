import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  minDate,
  maxDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeSelectorProps) {
  return (
    <Card className="border-green-500/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="flex items-center gap-2 text-white md:pb-[18px]">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="font-semibold whitespace-nowrap">Filter by Date Range:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <label className="text-xs text-white/60 mb-1 block">From</label>
              <input
                type="month"
                value={startDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-white/60 mb-1 block">To</label>
              <input
                type="month"
                value={endDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => {
              const now = new Date();
              const currentYear = now.getFullYear();
              onStartDateChange(`${currentYear}-01`);
              onEndDateChange(`${currentYear}-12`);
            }}
            className="px-4 py-2 h-[42px] rounded-md bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium whitespace-nowrap self-start md:self-auto"
          >
            Reset to Current Year
          </button>
        </div>
        
        <p className="text-xs text-white/40 mt-3">
          Tip: All statistics will be calculated based on the selected date range
        </p>
      </CardContent>
    </Card>
  );
}

