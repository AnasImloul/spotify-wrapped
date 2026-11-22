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
import { generateHeatmap } from '@/shared/services';
import { Grid3x3, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { formatMinutes, type TimeUnit } from '@/shared/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Tooltip component that renders via portal
function Tooltip({
  children,
  visible,
  x,
  y,
}: {
  children: React.ReactNode;
  visible: boolean;
  x: number;
  y: number;
}) {
  if (!visible) return null;

  return createPortal(
    <div
      className="fixed px-2.5 py-1.5 bg-popover border border-input text-foreground text-xs leading-relaxed tabular-nums whitespace-nowrap z-[9999] pointer-events-none shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-8px',
      }}
    >
      {children}
    </div>,
    document.body
  );
}

interface ListeningHeatmapProps {
  timeUnit?: TimeUnit;
}

export function ListeningHeatmap({ timeUnit = 'hours' }: ListeningHeatmapProps) {
  const { streamingHistory } = useSpotifyData();
  const { startDate, endDate } = useDateRange();
  const [viewMode, setViewMode] = useState<'detailed' | 'calendar'>('detailed');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  const handleMouseEnter = (e: React.MouseEvent, content: React.ReactNode) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top,
      content,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, content: null });
  };

  // First, filter streaming history by global date range
  const dateFilteredHistory = useMemo(() => {
    if (!streamingHistory || streamingHistory.length === 0) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    return streamingHistory.filter((entry) => {
      const date = new Date(entry.endTime);
      return date >= start && date <= end;
    });
  }, [streamingHistory, startDate, endDate]);

  // Get available years from date-filtered streaming history
  const availableYears = useMemo(() => {
    if (dateFilteredHistory.length === 0) return [];

    const years = new Set<number>();
    dateFilteredHistory.forEach((entry) => {
      const year = new Date(entry.endTime).getFullYear();
      years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a); // Descending order
  }, [dateFilteredHistory]);

  // Initialize selected year to the most recent year
  useMemo(() => {
    if (availableYears.length > 0 && selectedYear === null) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Filter streaming history by selected year
  const filteredHistory = useMemo(() => {
    if (!streamingHistory || selectedYear === null) return streamingHistory;

    return streamingHistory.filter((entry) => {
      const year = new Date(entry.endTime).getFullYear();
      return year === selectedYear;
    });
  }, [streamingHistory, selectedYear]);

  const heatmapData = useMemo(() => {
    if (!filteredHistory || filteredHistory.length === 0) return null;
    return generateHeatmap(filteredHistory);
  }, [filteredHistory]);

  // Generate calendar view data (daily aggregates)
  const calendarData = useMemo(() => {
    if (!filteredHistory || filteredHistory.length === 0 || selectedYear === null) return null;

    // Create a map of date -> minutes
    const dailyMinutes = new Map<string, number>();

    filteredHistory.forEach((entry) => {
      const date = new Date(entry.endTime);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const minutes = entry.msPlayed ? entry.msPlayed / 60000 : 0;
      dailyMinutes.set(dateKey, (dailyMinutes.get(dateKey) || 0) + minutes);
    });

    // Find the date range for the selected year
    const start = new Date(selectedYear, 0, 1); // January 1st
    const end = new Date(selectedYear, 11, 31); // December 31st

    // Find which day of week the start date is (0 = Sunday)
    const startDayOfWeek = start.getDay();

    // Calculate weeks needed
    const days: Array<{ date: Date; dateKey: string; minutes: number }> = [];
    const current = new Date(start);

    // Add padding days for the first week (if start day is not Sunday)
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: new Date(0), dateKey: '', minutes: 0 });
    }

    // Add all days in range
    while (current <= end) {
      const dateKey = current.toISOString().split('T')[0];
      days.push({
        date: new Date(current),
        dateKey,
        minutes: dailyMinutes.get(dateKey) || 0,
      });
      current.setDate(current.getDate() + 1);
    }

    // Calculate max value for color scaling
    const maxValue = Math.max(...Array.from(dailyMinutes.values()), 1);

    // Group into weeks
    const weeks: (typeof days)[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return { weeks, maxValue };
  }, [filteredHistory, selectedYear]);

  // Year navigation handlers
  const handlePreviousYear = () => {
    if (!availableYears.length || selectedYear === null) return;
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1]);
    }
  };

  const handleNextYear = () => {
    if (!availableYears.length || selectedYear === null) return;
    const currentIndex = availableYears.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(availableYears[currentIndex - 1]);
    }
  };

  const canGoPrevious =
    selectedYear !== null && availableYears.indexOf(selectedYear) < availableYears.length - 1;
  const canGoNext = selectedYear !== null && availableYears.indexOf(selectedYear) > 0;

  if (!heatmapData) {
    return null;
  }

  // Get color intensity based on value for both views
  const getColor = (value: number, maxVal: number): string => {
    if (value === 0) return 'bg-white/[0.06]';

    const intensity = value / maxVal;

    if (intensity < 0.2) return 'bg-primary/20';
    if (intensity < 0.4) return 'bg-primary/40';
    if (intensity < 0.6) return 'bg-primary/60';
    if (intensity < 0.8) return 'bg-primary/80';
    return 'bg-primary';
  };

  // Format date for display
  const formatDate = (date: Date): string =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Listening Heatmap</CardTitle>
            <CardDescription>Your listening activity by day of week and hour</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-input">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePreviousYear}
                disabled={!canGoPrevious}
                aria-label="Previous year"
                className="h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-semibold tabular-nums min-w-[56px] text-center text-sm">
                {selectedYear || 'All'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextYear}
                disabled={!canGoNext}
                aria-label="Next year"
                className="h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div role="group" aria-label="Heatmap view" className="flex border border-input">
              {(
                [
                  { mode: 'detailed', label: 'Hourly', Icon: Grid3x3 },
                  { mode: 'calendar', label: 'Daily', Icon: CalendarIcon },
                ] as const
              ).map(({ mode, label, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  aria-pressed={viewMode === mode}
                  aria-label={label}
                  className={`h-8 px-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors border-r border-input last:border-r-0 ${
                    viewMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-x-auto overflow-y-visible">
          {viewMode === 'detailed' ? (
            // Detailed view - hourly heatmap by day of week
            <div className="w-full pt-8 pb-2 overflow-x-auto">
              <div className="w-max mx-auto">
                {/* Hour labels */}
                <div className="flex mb-2 gap-1">
                  <div className="w-8 flex-shrink-0"></div>
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="w-4 md:w-6 lg:w-8 text-center text-[10px] tabular-nums text-muted-foreground"
                    >
                      {hour % 3 === 0 ? (hour === 0 ? '0' : hour) : ''}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {DAYS.map((day, dayIndex) => (
                  <div key={day} className="flex items-center mb-1 gap-1">
                    {/* Day label */}
                    <div className="w-8 text-[11px] text-muted-foreground flex-shrink-0 text-right pr-2 self-center">
                      {day}
                    </div>

                    {/* Hour cells */}
                    <div className="flex gap-1">
                      {HOURS.map((hour) => {
                        const value = heatmapData.data[dayIndex][hour];
                        const count = heatmapData.counts[dayIndex][hour];
                        const average = count > 0 ? value / count : 0;
                        return (
                          <div
                            key={hour}
                            className={`w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 ${getColor(value, heatmapData.maxValue)} cursor-pointer hover:outline hover:outline-1 hover:outline-foreground`}
                            onMouseEnter={(e) =>
                              handleMouseEnter(
                                e,
                                <>
                                  {day} {hour}:00
                                  <br />
                                  Total: {formatMinutes(value, timeUnit)}
                                  <br />
                                  Avg: {formatMinutes(average, timeUnit)} ({count}{' '}
                                  {count === 1 ? 'day' : 'days'})
                                </>
                              )
                            }
                            onMouseLeave={handleMouseLeave}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Calendar view - GitHub-style year view with each day
            calendarData && (
              <div className="flex flex-col w-full pt-8 pb-2 overflow-x-auto">
                {/* Year label */}
                <div className="flex gap-1 mb-2 justify-center">
                  <div className="text-sm font-semibold tabular-nums">{selectedYear}</div>
                </div>

                {/* Center wrapper */}
                <div className="flex justify-center w-full">
                  <div className="flex gap-1 min-w-max">
                    {/* Day labels */}
                    <div className="flex flex-col gap-1 justify-start pt-5 flex-shrink-0">
                      {['Mon', 'Wed', 'Fri'].map((day) => (
                        <div
                          key={day}
                          className="h-3 flex items-center text-[10px] text-muted-foreground"
                          style={{ marginBottom: '6px' }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar grid - each column is a week */}
                    <div className="flex gap-1">
                      {calendarData.weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {week.map((day, dayIndex) => {
                            // Check if this is the first day of a month
                            const isFirstOfMonth = day.date.getDate() === 1;
                            const monthLabel = isFirstOfMonth ? MONTHS[day.date.getMonth()] : null;

                            return (
                              <div key={`${weekIndex}-${dayIndex}`} className="relative">
                                {/* Month label above first day of month */}
                                {dayIndex === 0 && monthLabel && (
                                  <div className="absolute -top-4 left-0 text-[10px] text-muted-foreground whitespace-nowrap">
                                    {monthLabel}
                                  </div>
                                )}
                                <div
                                  className={`w-3 h-3 ${
                                    day.dateKey
                                      ? getColor(day.minutes, calendarData.maxValue)
                                      : 'bg-transparent'
                                  } ${day.dateKey ? 'cursor-pointer hover:outline hover:outline-1 hover:outline-foreground' : ''}`}
                                  onMouseEnter={
                                    day.dateKey
                                      ? (e) =>
                                          handleMouseEnter(
                                            e,
                                            <>
                                              {formatDate(day.date)}
                                              <br />
                                              {formatMinutes(day.minutes, timeUnit)}
                                            </>
                                          )
                                      : undefined
                                  }
                                  onMouseLeave={day.dateKey ? handleMouseLeave : undefined}
                                />
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              {[
                'bg-white/[0.06]',
                'bg-primary/20',
                'bg-primary/40',
                'bg-primary/60',
                'bg-primary/80',
                'bg-primary',
              ].map((cls) => (
                <div key={cls} className={`w-4 h-4 ${cls}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>

      {/* Global tooltip rendered via portal */}
      <Tooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        {tooltip.content}
      </Tooltip>
    </Card>
  );
}
