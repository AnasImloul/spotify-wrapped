import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useSpotifyData, useDateRange } from '@/shared/hooks';
import { analyzeListeningPatterns } from '@/shared/services';
import { formatMinutes, type TimeUnit } from '@/shared/utils';
import { Calendar, Sun, Moon, Clock } from 'lucide-react';

export function ListeningPatterns() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('minutes');
  const { streamingHistory } = useSpotifyData();
  const { startDate, endDate } = useDateRange();

  // Filter streaming history by global date range
  const filteredHistory = useMemo(() => {
    if (!streamingHistory || streamingHistory.length === 0) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    return streamingHistory.filter((entry) => {
      const date = new Date(entry.endTime);
      return date >= start && date <= end;
    });
  }, [streamingHistory, startDate, endDate]);

  const patterns = useMemo(() => {
    if (filteredHistory.length === 0) return null;
    return analyzeListeningPatterns(filteredHistory);
  }, [filteredHistory]);

  if (!patterns) {
    return null;
  }

  // Calculate averages per day using actual day counts
  const avgWeekdayMinutes =
    patterns.weekdayCount > 0 ? patterns.weekdayMinutes / patterns.weekdayCount : 0;
  const avgWeekendMinutes =
    patterns.weekendCount > 0 ? patterns.weekendMinutes / patterns.weekendCount : 0;

  // Calculate averages for day/night
  const avgDayMinutes = patterns.dayCount > 0 ? patterns.dayMinutes / patterns.dayCount : 0;
  const avgNightMinutes = patterns.dayCount > 0 ? patterns.nightMinutes / patterns.dayCount : 0;

  // Calculate averages for time of day breakdown
  const avgMorningMinutes = patterns.dayCount > 0 ? patterns.morningMinutes / patterns.dayCount : 0;
  const avgAfternoonMinutes =
    patterns.dayCount > 0 ? patterns.afternoonMinutes / patterns.dayCount : 0;
  const avgEveningMinutes = patterns.dayCount > 0 ? patterns.eveningMinutes / patterns.dayCount : 0;
  const avgLateNightMinutes =
    patterns.dayCount > 0 ? patterns.lateNightMinutes / patterns.dayCount : 0;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Listening Patterns</CardTitle>
            <CardDescription className="text-white/60">
              When you listen to music most
            </CardDescription>
          </div>

          {/* Time Unit Toggle */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant={timeUnit === 'minutes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeUnit('minutes')}
              className={timeUnit === 'minutes' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <Clock className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="sm:hidden">min</span>
              <span className="hidden sm:inline">Minutes</span>
            </Button>
            <Button
              variant={timeUnit === 'hours' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeUnit('hours')}
              className={timeUnit === 'hours' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <Clock className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="sm:hidden">hr</span>
              <span className="hidden sm:inline">Hours</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Weekday vs Weekend */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Weekday vs Weekend</h3>
            <span className="text-xs text-white/50">(Average per Day)</span>
          </div>

          {/* Average per day comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Weekday</p>
              <p className="text-2xl font-bold text-green-400">
                {formatMinutes(avgWeekdayMinutes, timeUnit)}
              </p>
              <p className="text-white/40 text-[10px] mt-1">({patterns.weekdayCount} days)</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Weekend Day</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatMinutes(avgWeekendMinutes, timeUnit)}
              </p>
              <p className="text-white/40 text-[10px] mt-1">({patterns.weekendCount} days)</p>
            </div>
          </div>
        </div>

        {/* Day vs Night */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Sun className="w-5 h-5 text-green-400" />
              <Moon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Day vs Night</h3>
            <span className="text-xs text-white/50">(Average per Day)</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Day (6AM-6PM)</p>
              <p className="text-2xl font-bold text-green-400">
                {formatMinutes(avgDayMinutes, timeUnit)}
              </p>
              <p className="text-white/60 text-xs mt-1">{patterns.dayPercentage}% of total</p>
              <p className="text-white/40 text-[10px] mt-1">({patterns.dayCount} days)</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Night (6PM-6AM)</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatMinutes(avgNightMinutes, timeUnit)}
              </p>
              <p className="text-white/60 text-xs mt-1">{patterns.nightPercentage}% of total</p>
              <p className="text-white/40 text-[10px] mt-1">({patterns.dayCount} days)</p>
            </div>
          </div>
        </div>

        {/* Time of Day Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Time of Day Breakdown</h3>
            <span className="text-xs text-white/50">(Average per Day)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Morning</p>
              <p className="text-white/50 text-xs mb-2">6AM-12PM</p>
              <p className="text-2xl font-bold text-green-500">
                {formatMinutes(avgMorningMinutes, timeUnit)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Afternoon</p>
              <p className="text-white/50 text-xs mb-2">12PM-6PM</p>
              <p className="text-2xl font-bold text-green-400">
                {formatMinutes(avgAfternoonMinutes, timeUnit)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Evening</p>
              <p className="text-white/50 text-xs mb-2">6PM-12AM</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatMinutes(avgEveningMinutes, timeUnit)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Late Night</p>
              <p className="text-white/50 text-xs mb-2">12AM-6AM</p>
              <p className="text-2xl font-bold text-blue-500">
                {formatMinutes(avgLateNightMinutes, timeUnit)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
