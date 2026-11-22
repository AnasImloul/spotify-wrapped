import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useSpotifyData, useDateRange } from '@/shared/hooks';
import { analyzeListeningPatterns } from '@/shared/services';
import { formatMinutes, type TimeUnit } from '@/shared/utils';
import { Clock } from 'lucide-react';

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

  const groups: {
    title: string;
    cols: string;
    items: { label: string; range?: string; value: number; swatch: string; notes: string[] }[];
  }[] = [
    {
      title: 'Weekday vs Weekend',
      cols: 'grid-cols-2',
      items: [
        {
          label: 'Avg Weekday',
          value: avgWeekdayMinutes,
          swatch: 'bg-code-green',
          notes: [`(${patterns.weekdayCount} days)`],
        },
        {
          label: 'Avg Weekend Day',
          value: avgWeekendMinutes,
          swatch: 'bg-code-blue',
          notes: [`(${patterns.weekendCount} days)`],
        },
      ],
    },
    {
      title: 'Day vs Night',
      cols: 'grid-cols-2',
      items: [
        {
          label: 'Avg Day (6AM-6PM)',
          value: avgDayMinutes,
          swatch: 'bg-code-yellow',
          notes: [`${patterns.dayPercentage}% of total`, `(${patterns.dayCount} days)`],
        },
        {
          label: 'Avg Night (6PM-6AM)',
          value: avgNightMinutes,
          swatch: 'bg-code-blue',
          notes: [`${patterns.nightPercentage}% of total`, `(${patterns.dayCount} days)`],
        },
      ],
    },
    {
      title: 'Time of Day Breakdown',
      cols: 'grid-cols-2 sm:grid-cols-4',
      items: [
        {
          label: 'Morning',
          range: '6AM-12PM',
          value: avgMorningMinutes,
          swatch: 'bg-code-yellow',
          notes: [],
        },
        {
          label: 'Afternoon',
          range: '12PM-6PM',
          value: avgAfternoonMinutes,
          swatch: 'bg-code-orange',
          notes: [],
        },
        {
          label: 'Evening',
          range: '6PM-12AM',
          value: avgEveningMinutes,
          swatch: 'bg-code-green',
          notes: [],
        },
        {
          label: 'Late Night',
          range: '12AM-6AM',
          value: avgLateNightMinutes,
          swatch: 'bg-code-blue',
          notes: [],
        },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Listening Patterns</CardTitle>
            <CardDescription>When you listen to music most</CardDescription>
          </div>

          <div
            role="group"
            aria-label="Time unit"
            className="flex border border-input flex-shrink-0"
          >
            {(['minutes', 'hours'] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setTimeUnit(unit)}
                aria-pressed={timeUnit === unit}
                className={`h-8 px-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors border-r border-input last:border-r-0 ${
                  timeUnit === unit
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <Clock className="w-4 h-4" aria-hidden />
                <span className="sm:hidden">{unit === 'minutes' ? 'min' : 'hr'}</span>
                <span className="hidden sm:inline">{unit === 'minutes' ? 'Minutes' : 'Hours'}</span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="flex items-baseline gap-2 mb-1">
              <h4 className="text-base font-semibold">{group.title}</h4>
              <span className="text-xs text-muted-foreground">(Average per Day)</span>
            </div>
            <dl className={`grid ${group.cols} gap-x-6 border-t border-border`}>
              {group.items.map((item) => (
                <div key={item.label} className="py-3 border-b border-border">
                  <dt className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 flex-shrink-0 ${item.swatch}`} aria-hidden />
                    <span className="label-caps">{item.label}</span>
                  </dt>
                  {item.range && (
                    <dd className="text-xs text-muted-foreground mt-0.5">{item.range}</dd>
                  )}
                  <dd className="text-2xl font-medium tabular-nums mt-1">
                    {formatMinutes(item.value, timeUnit)}
                  </dd>
                  {item.notes.map((note) => (
                    <dd key={note} className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                      {note}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
