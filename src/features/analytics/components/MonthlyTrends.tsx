import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_AXIS, CHART_COLORS, CHART_GRID, CHART_TOOLTIP } from '@/shared/constants/charts';
import { useSpotifyData, useDateRange } from '@/shared/hooks';
import { generateMonthlyTrends } from '@/shared/services';
import { formatNumber, formatMinutes, type TimeUnit } from '@/shared/utils';
import { Clock } from 'lucide-react';

export function MonthlyTrends() {
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

  const trendsData = useMemo(() => {
    if (filteredHistory.length === 0) return [];
    return generateMonthlyTrends(filteredHistory);
  }, [filteredHistory]);

  if (trendsData.length === 0) {
    return null;
  }

  // Format month label (YYYY-MM -> Mon YYYY)
  const formatMonthLabel = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-input p-3 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
          <p className="text-muted-foreground text-xs mb-1">{formatMonthLabel(data.month)}</p>
          <div className="space-y-0.5 text-sm tabular-nums">
            <p className="font-semibold text-primary">{formatMinutes(data.minutes, timeUnit)}</p>
            <p className="text-muted-foreground">{formatNumber(data.trackCount)} tracks played</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Monthly Trends</CardTitle>
            <CardDescription>Your listening activity over time</CardDescription>
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
      <CardContent className="pt-6">
        <div className="h-[300px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendsData}
              margin={{ top: 5, right: 10, left: timeUnit === 'minutes' ? 10 : 0, bottom: 5 }}
            >
              <CartesianGrid {...CHART_GRID} />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                {...CHART_AXIS}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                {...CHART_AXIS}
                axisLine={false}
                width={timeUnit === 'minutes' ? 55 : 45}
                label={{
                  value: timeUnit === 'hours' ? 'Hours' : 'Minutes',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: CHART_COLORS.textMuted, fontSize: 11 },
                  offset: timeUnit === 'minutes' ? 10 : 0,
                }}
                tickFormatter={(value) => {
                  if (timeUnit === 'hours') {
                    return `${formatNumber(Math.round(value / 60))}h`;
                  }
                  // Compact format for large numbers
                  const rounded = Math.round(value);
                  if (rounded >= 10000) {
                    return `${(rounded / 1000).toFixed(0)}k`;
                  } else if (rounded >= 1000) {
                    return `${(rounded / 1000).toFixed(1)}k`;
                  }
                  return `${rounded}`;
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={CHART_TOOLTIP.cursor} />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: CHART_COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 border-t border-border">
          {[
            { label: 'Months', value: String(trendsData.length) },
            {
              label: 'Avg/Month',
              value: formatMinutes(
                Math.round(trendsData.reduce((sum, m) => sum + m.minutes, 0) / trendsData.length),
                timeUnit
              ),
            },
            {
              label: 'Peak',
              value: formatMinutes(Math.max(...trendsData.map((m) => m.minutes)), timeUnit),
            },
            {
              label: 'Peak Month',
              value: formatMonthLabel(
                trendsData.reduce((max, m) => (m.minutes > max.minutes ? m : max)).month
              ),
            },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col py-3 border-b border-border">
              <dt className="label-caps mt-1 order-2">{stat.label}</dt>
              <dd className="order-1 text-2xl font-medium tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
