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
  CHART_X_AXIS,
} from '@/shared/constants/charts';
import { msToMinutes, formatNumber } from '@/shared/utils';
import { useSpotifyData, useStatsRange, useSortedArtists } from '@/shared/hooks';

interface ArtistComparisonProps {
  onClose: () => void;
  initialArtists?: string[];
}

const COLORS = CHART_SERIES;

export function ArtistComparison({ onClose, initialArtists = [] }: ArtistComparisonProps) {
  const { streamingHistory } = useSpotifyData();
  const { startDate, endDate } = useStatsRange();
  const sortedArtists = useSortedArtists();
  const [selectedArtists, setSelectedArtists] = useState<string[]>(initialArtists.slice(0, 5));
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
  const artistFuse = useMemo(
    () =>
      new Fuse(sortedArtists, {
        keys: ['name'],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 1,
      }),
    [sortedArtists]
  );

  // Filter and sort available artists based on search
  const filteredArtists = useMemo(() => {
    // Filter out already selected artists
    const unselectedArtists = sortedArtists.filter(
      (artist) => !selectedArtists.includes(artist.name)
    );

    // If no search term, return already-sorted list (respects global sortBy setting)
    if (!searchTerm.trim()) {
      return unselectedArtists.slice(0, 20);
    }

    // Use fuzzy search
    const results = artistFuse.search(searchTerm);
    return results
      .map((result) => result.item)
      .filter((artist) => !selectedArtists.includes(artist.name))
      .slice(0, 20);
  }, [sortedArtists, selectedArtists, searchTerm, artistFuse]);

  // Calculate data for all selected artists
  const chartData = useMemo(() => {
    // First, collect all months
    const monthsSet = new Set<string>();
    const artistData = new Map<string, Map<string, number>>();

    // Initialize data structures for each artist
    selectedArtists.forEach((artist) => {
      artistData.set(artist, new Map());
    });

    // Process streaming history
    streamingHistory.forEach((entry) => {
      if (!selectedArtists.includes(entry.artistName)) return;

      const entryDate = new Date(entry.endTime);
      const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;

      // Date range filter
      if (startDate && monthKey < startDate) return;
      if (endDate && monthKey > endDate) return;

      monthsSet.add(monthKey);

      const artistMap = artistData.get(entry.artistName)!;
      const currentMinutes = artistMap.get(monthKey) || 0;
      artistMap.set(monthKey, currentMinutes + entry.msPlayed / 1000 / 60);
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

      selectedArtists.forEach((artist) => {
        const minutes = artistData.get(artist)?.get(month) || 0;
        dataPoint[artist] = Math.round(minutes);
      });

      return dataPoint;
    });
  }, [streamingHistory, selectedArtists, startDate, endDate]);

  const addArtist = (artist: string) => {
    if (selectedArtists.length < 8) {
      setSelectedArtists([...selectedArtists, artist]);
      setSearchTerm('');
      setShowAutocomplete(false);
    }
  };

  const removeArtist = (artist: string) => {
    setSelectedArtists(selectedArtists.filter((a) => a !== artist));
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
                Artist Comparison
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare listening patterns across multiple artists
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
            {/* Artist Selection */}
            <div>
              <h3 className="label-caps mb-3">Selected Artists ({selectedArtists.length}/8)</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedArtists.map((artist, index) => (
                  <div
                    key={artist}
                    className="flex items-center gap-2 border border-border px-3 py-2"
                  >
                    <div
                      className="w-2.5 h-2.5 flex-shrink-0"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-foreground">{artist}</span>
                    <button
                      onClick={() => removeArtist(artist)}
                      className="p-1 -mr-1 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedArtists.length < 8 && (
                <div className="space-y-2" ref={searchContainerRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Type artist name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowAutocomplete(true)}
                      className="bg-transparent border-input placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
                      autoComplete="off"
                    />
                  </div>
                  {showAutocomplete && (searchTerm || filteredArtists.length > 0) && (
                    <div className="bg-popover border border-border max-h-60 overflow-y-auto custom-scrollbar shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
                      {filteredArtists.length > 0 ? (
                        filteredArtists.map((artist) => (
                          <button
                            key={artist.name}
                            onClick={() => addArtist(artist.name)}
                            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-white/[0.03] transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-semibold text-primary w-8 text-center flex-shrink-0">
                                #{artist.rank}
                              </span>
                              <span className="truncate">{artist.name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                              {formatNumber(msToMinutes(artist.totalMs))} min
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                          No artists found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chart */}
            {selectedArtists.length > 0 && chartData.length > 0 ? (
              <div>
                <h3 className="label-caps mb-3">Listening Activity Over Time</h3>
                <div className="border border-border p-3 sm:p-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid {...CHART_GRID} />
                      <XAxis dataKey="month" {...CHART_X_AXIS} />
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
                        iconType="square"
                      />
                      {selectedArtists.map((artist, index) => (
                        <Line
                          key={artist}
                          type="monotone"
                          dataKey={artist}
                          stroke={COLORS[index]}
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-input">
                {selectedArtists.length === 0
                  ? 'Add artists to start comparing their listening patterns'
                  : 'No listening data available for the selected date range'}
              </div>
            )}

            {/* Summary Stats */}
            {selectedArtists.length > 0 && chartData.length > 0 && (
              <div>
                <h3 className="label-caps mb-3">Total Listening Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedArtists.map((artist, index) => {
                    const totalMinutes = chartData.reduce(
                      (sum, month) => sum + (month[artist] || 0),
                      0
                    );
                    return (
                      <div key={artist} className="border-t border-border pt-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-2.5 h-2.5 flex-shrink-0"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <p className="text-xs text-muted-foreground truncate">{artist}</p>
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
