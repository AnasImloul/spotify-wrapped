import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{formatMonthLabel(data.month)}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-400">
              {formatMinutes(data.minutes, timeUnit)}
            </p>
            <p className="text-white/60">{formatNumber(data.trackCount)} tracks played</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Monthly Trends</CardTitle>
            <CardDescription className="text-white/60">
              Your listening activity over time
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
      <CardContent>
        <div className="h-[300px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendsData}
              margin={{ top: 5, right: 10, left: timeUnit === 'minutes' ? 10 : 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonthLabel}
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="rgba(255,255,255,0.6)"
                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                width={timeUnit === 'minutes' ? 55 : 45}
                label={{
                  value: timeUnit === 'hours' ? 'Hours' : 'Minutes',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: 'rgba(255,255,255,0.6)', fontSize: 12 },
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
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#1db954"
                strokeWidth={3}
                dot={{ fill: '#1db954', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {trendsData.length}
            </p>
            <p className="text-sm text-white/60">Months</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {formatMinutes(Math.round(trendsData.reduce((sum, m) => sum + m.minutes, 0) / trendsData.length), timeUnit)}
            </p>
            <p className="text-sm text-white/60">Avg/Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {formatMinutes(Math.max(...trendsData.map(m => m.minutes)), timeUnit)}
            </p>
            <p className="text-sm text-white/60">Peak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {formatMonthLabel(trendsData.reduce((max, m) => m.minutes > max.minutes ? m : max).month)}
            </p>
            <p className="text-sm text-white/60">Peak Month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

