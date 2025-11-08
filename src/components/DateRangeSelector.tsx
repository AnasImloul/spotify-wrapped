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
    <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="flex items-center gap-2 text-white md:pb-[18px]">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="font-semibold whitespace-nowrap">Filter by Date Range:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1">
              <label className="text-xs text-green-300/80 mb-1.5 block font-medium">From</label>
              <input
                type="month"
                value={startDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-green-500/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 hover:bg-black/50 hover:border-green-500/30 transition-all duration-200 font-medium"
              />
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-green-300/80 mb-1.5 block font-medium">To</label>
              <input
                type="month"
                value={endDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-green-500/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500/40 hover:bg-black/50 hover:border-green-500/30 transition-all duration-200 font-medium"
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
            className="px-4 py-2.5 h-[42px] rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-300 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-green-600/30 hover:border-green-500/40 transition-all duration-200 text-sm font-medium whitespace-nowrap self-start md:self-auto shadow-lg shadow-green-500/10"
          >
            Reset to Current Year
          </button>
        </div>
        
        <p className="text-xs text-white/40 mt-4 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-green-400/50"></span>
          All statistics will be calculated based on the selected date range
        </p>
      </CardContent>
    </Card>
  );
}

