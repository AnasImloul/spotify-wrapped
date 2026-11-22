import { useState, useMemo, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';
import { X, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  CHART_AXIS,
  CHART_COLORS,
  CHART_GRID,
  CHART_SERIES,
  CHART_TOOLTIP,
} from '@/shared/constants/charts';
import { msToMinutes, formatNumber } from '@/shared/utils';
import { useSpotifyData, useDateRange, useSortedTracks } from '@/shared/hooks';

interface TrackComparisonProps {
  onClose: () => void;
  initialTracks?: Array<{ name: string; artist: string }>;
}

const COLORS = CHART_SERIES;

export function TrackComparison({ onClose, initialTracks = [] }: TrackComparisonProps) {
  const { streamingHistory } = useSpotifyData();
  const { startDate, endDate } = useDateRange();
  const sortedTracks = useSortedTracks();
  const [selectedTracks, setSelectedTracks] = useState<Array<{ name: string; artist: string }>>(
    initialTracks.slice(0, 5)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Configure Fuse.js for fuzzy search
  const trackFuse = useMemo(
    () =>
      new Fuse(sortedTracks, {
        keys: ['name', 'artist'],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 1,
      }),
    [sortedTracks]
  );

  // Filter and sort available tracks based on search
  const filteredTracks = useMemo(() => {
    // Filter out already selected tracks
    const unselectedTracks = sortedTracks.filter(
      (track) => !selectedTracks.some((t) => t.name === track.name && t.artist === track.artist)
    );

    // If no search term, return already-sorted list (respects global sortBy setting)
    if (!searchTerm.trim()) {
      return unselectedTracks.slice(0, 20);
    }

    // Use fuzzy search
    const results = trackFuse.search(searchTerm);
    return results
      .map((result) => result.item)
      .filter(
        (track) => !selectedTracks.some((t) => t.name === track.name && t.artist === track.artist)
      )
      .slice(0, 20);
  }, [sortedTracks, selectedTracks, searchTerm, trackFuse]);

  // Calculate data for all selected tracks
  const chartData = useMemo(() => {
    // First, collect all months
    const monthsSet = new Set<string>();
    const trackData = new Map<string, Map<string, number>>();

    // Initialize data structures for each track
    selectedTracks.forEach((track) => {
      const trackKey = `${track.name}|||${track.artist}`;
      trackData.set(trackKey, new Map());
    });

    // Process streaming history
    streamingHistory.forEach((entry) => {
      const trackKey = `${entry.trackName}|||${entry.artistName}`;
      if (!trackData.has(trackKey)) return;

      const entryDate = new Date(entry.endTime);
      const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;

      // Date range filter
      if (startDate && monthKey < startDate) return;
      if (endDate && monthKey > endDate) return;

      monthsSet.add(monthKey);

      const trackMap = trackData.get(trackKey)!;
      const currentMinutes = trackMap.get(monthKey) || 0;
      trackMap.set(monthKey, currentMinutes + entry.msPlayed / 1000 / 60);
    });

    // Convert to array format for Recharts
    const sortedMonths = Array.from(monthsSet).sort();

    return sortedMonths.map((month) => {
      const dataPoint: any = {
        month: new Date(`${month}-01`).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      };

      selectedTracks.forEach((track) => {
        const trackKey = `${track.name}|||${track.artist}`;
        const displayName = `${track.name} - ${track.artist}`;
        const minutes = trackData.get(trackKey)?.get(month) || 0;
        dataPoint[displayName] = Math.round(minutes);
      });

      return dataPoint;
    });
  }, [streamingHistory, selectedTracks, startDate, endDate]);

  const addTrack = (track: { name: string; artist: string }) => {
    if (selectedTracks.length < 8) {
      setSelectedTracks([...selectedTracks, track]);
      setSearchTerm('');
      setShowAutocomplete(false);
    }
  };

  const removeTrack = (track: { name: string; artist: string }) => {
    setSelectedTracks(
      selectedTracks.filter((t) => !(t.name === track.name && t.artist === track.artist))
    );
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-card">
      <Card
        role="dialog"
        aria-modal="true"
        className="w-full max-w-6xl h-full sm:h-[90vh] flex flex-col border-border bg-popover shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
      >
        <CardHeader className="border-b border-foreground flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl font-semibold mb-1">
                Track Comparison
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare listening patterns across multiple tracks
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {/* Track Selection */}
            <div>
              <h3 className="label-caps mb-3">Selected Tracks ({selectedTracks.length}/8)</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTracks.map((track, index) => (
                  <div
                    key={`${track.name}-${track.artist}`}
                    className="flex items-center gap-2 border border-border px-3 py-2"
                  >
                    <div
                      className="w-2.5 h-2.5 flex-shrink-0"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{track.name}</span>
                      <span className="text-xs text-muted-foreground">{track.artist}</span>
                    </div>
                    <button
                      onClick={() => removeTrack(track)}
                      className="p-1 -mr-1 hover:bg-white/5 transition-colors ml-2"
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedTracks.length < 8 && (
                <div className="space-y-2" ref={searchContainerRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Type track name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowAutocomplete(true)}
                      className="bg-white/[0.03] border-border text-foreground placeholder:text-muted-foreground"
                      autoComplete="off"
                    />
                  </div>
                  {showAutocomplete && (searchTerm || filteredTracks.length > 0) && (
                    <div className="bg-popover border border-border max-h-60 overflow-y-auto custom-scrollbar shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
                      {filteredTracks.length > 0 ? (
                        filteredTracks.map((track) => (
                          <button
                            key={`${track.name}-${track.artist}`}
                            onClick={() => addTrack({ name: track.name, artist: track.artist })}
                            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-white/[0.03] transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-semibold text-code-blue w-8 text-center flex-shrink-0">
                                #{track.rank}
                              </span>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="truncate">{track.name}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {track.artist}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                              {formatNumber(msToMinutes(track.totalMs))} min
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                          No tracks found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chart */}
            {selectedTracks.length > 0 && chartData.length > 0 ? (
              <div>
                <h3 className="label-caps mb-3">Listening Activity Over Time</h3>
                <div className="border border-border p-3 sm:p-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid {...CHART_GRID} />
                      <XAxis
                        dataKey="month"
                        {...CHART_AXIS}
                        style={{ fontSize: '11px' }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        {...CHART_AXIS}
                        style={{ fontSize: '11px' }}
                        label={{
                          value: 'Minutes',
                          angle: -90,
                          position: 'insideLeft',
                          fill: CHART_COLORS.textMuted,
                          style: { fontSize: '11px' },
                        }}
                      />
                      <Tooltip
                        {...CHART_TOOLTIP}
                        formatter={(value: number, name: string) => [`${value} min`, name]}
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '10px',
                          color: CHART_COLORS.textMuted,
                        }}
                        iconType="line"
                      />
                      {selectedTracks.map((track, index) => {
                        const displayName = `${track.name} - ${track.artist}`;
                        return (
                          <Line
                            key={displayName}
                            type="monotone"
                            dataKey={displayName}
                            stroke={COLORS[index]}
                            strokeWidth={2.5}
                            dot={{ fill: COLORS[index], r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-input">
                {selectedTracks.length === 0
                  ? 'Add tracks to start comparing their listening patterns'
                  : 'No listening data available for the selected date range'}
              </div>
            )}

            {/* Summary Stats */}
            {selectedTracks.length > 0 && chartData.length > 0 && (
              <div>
                <h3 className="label-caps mb-3">Total Listening Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedTracks.map((track, index) => {
                    const displayName = `${track.name} - ${track.artist}`;
                    const totalMinutes = chartData.reduce(
                      (sum, month) => sum + (month[displayName] || 0),
                      0
                    );
                    return (
                      <div key={displayName} className="border-t border-border pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-2.5 h-2.5 flex-shrink-0"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-xs text-foreground truncate">{track.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {track.artist}
                            </p>
                          </div>
                        </div>
                        <p className="text-xl font-medium tabular-nums">
                          {totalMinutes.toLocaleString()} min
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
