import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSpotifyData, useDateRange } from '@/shared/hooks';
import { analyzeListeningPatterns } from '@/shared/services';
import { formatNumber, formatMinutes, type TimeUnit } from '@/shared/utils';
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
  const avgWeekdayMinutes = patterns.weekdayCount > 0 ? patterns.weekdayMinutes / patterns.weekdayCount : 0;
  const avgWeekendMinutes = patterns.weekendCount > 0 ? patterns.weekendMinutes / patterns.weekendCount : 0;
  
  // Calculate averages for day/night
  const avgDayMinutes = patterns.dayCount > 0 ? patterns.dayMinutes / patterns.dayCount : 0;
  const avgNightMinutes = patterns.dayCount > 0 ? patterns.nightMinutes / patterns.dayCount : 0;
  
  // Calculate averages for time of day breakdown
  const avgMorningMinutes = patterns.dayCount > 0 ? patterns.morningMinutes / patterns.dayCount : 0;
  const avgAfternoonMinutes = patterns.dayCount > 0 ? patterns.afternoonMinutes / patterns.dayCount : 0;
  const avgEveningMinutes = patterns.dayCount > 0 ? patterns.eveningMinutes / patterns.dayCount : 0;
  const avgLateNightMinutes = patterns.dayCount > 0 ? patterns.lateNightMinutes / patterns.dayCount : 0;

  // Data for average comparison chart
  const avgComparisonData = [
    { name: 'Avg Weekday', minutes: avgWeekdayMinutes, color: '#16a34a' },
    { name: 'Avg Weekend Day', minutes: avgWeekendMinutes, color: '#3b82f6' },
  ];

  // Data for time of day chart (averages per day)
  const timeOfDayData = [
    { name: 'Morning\n(6AM-12PM)', shortName: 'Morning', minutes: avgMorningMinutes, color: '#16a34a' },
    { name: 'Afternoon\n(12PM-6PM)', shortName: 'Afternoon', minutes: avgAfternoonMinutes, color: '#10b981' },
    { name: 'Evening\n(6PM-12AM)', shortName: 'Evening', minutes: avgEveningMinutes, color: '#3b82f6' },
    { name: 'Late Night\n(12AM-6AM)', shortName: 'Late Night', minutes: avgLateNightMinutes, color: '#2563eb' },
  ];

  // Custom X-axis tick for responsive labels
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const isMobile = window.innerWidth < 640; // sm breakpoint
    const entry = timeOfDayData.find(d => d.name === payload.value);
    const displayText = isMobile && entry ? entry.shortName : payload.value;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={10}
          textAnchor="middle"
          fill="rgba(255,255,255,0.6)"
          fontSize={isMobile ? 10 : 11}
        >
          {displayText.split('\n').map((line: string, index: number) => (
            <tspan x={0} dy={index === 0 ? 0 : 12} key={index}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{data.name}</p>
          <p className="text-green-400 text-sm">
            {formatMinutes(data.minutes, timeUnit)}
          </p>
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
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Weekday</p>
              <p className="text-2xl font-bold text-green-400">
                {formatMinutes(avgWeekdayMinutes, timeUnit)}
              </p>
              <p className="text-white/40 text-[10px] mt-1">
                ({patterns.weekdayCount} days)
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Weekend Day</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatMinutes(avgWeekendMinutes, timeUnit)}
              </p>
              <p className="text-white/40 text-[10px] mt-1">
                ({patterns.weekendCount} days)
              </p>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgComparisonData} margin={{ top: 20, right: 20, bottom: 20, left: timeUnit === 'minutes' ? 10 : 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                  width={timeUnit === 'minutes' ? 50 : 40}
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                  {avgComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Day (6AM-6PM)</p>
              <p className="text-2xl font-bold text-green-400">
                {formatMinutes(avgDayMinutes, timeUnit)}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {patterns.dayPercentage}% of total
              </p>
              <p className="text-white/40 text-[10px] mt-1">
                ({patterns.dayCount} days)
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-1">Avg Night (6PM-6AM)</p>
              <p className="text-2xl font-bold text-blue-400">
                {formatMinutes(avgNightMinutes, timeUnit)}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {patterns.nightPercentage}% of total
              </p>
              <p className="text-white/40 text-[10px] mt-1">
                ({patterns.dayCount} days)
              </p>
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
          
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeOfDayData} margin={{ top: 20, right: 20, bottom: 40, left: timeUnit === 'minutes' ? 10 : 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.6)"
                  tick={<CustomXAxisTick />}
                  interval={0}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.6)"
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                  width={timeUnit === 'minutes' ? 50 : 40}
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
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
                  {timeOfDayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

