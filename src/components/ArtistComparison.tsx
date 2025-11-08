import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { X, TrendingUp, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { StreamingHistoryEntry } from '@/types/spotify';
import { sortArtists } from '@/lib/sorting';
import { msToMinutes, formatNumber } from '@/lib/utils';

interface ArtistComparisonProps {
  streamingHistory: StreamingHistoryEntry[];
  startDate: string;
  endDate: string;
  onClose: () => void;
  initialArtists?: string[];
  availableArtists: { name: string; playCount: number; totalTime: number; rank: number }[];
}

const COLORS = [
  '#1DB954', // Spotify Green
  '#1E90FF', // Blue
  '#FF6B6B', // Red
  '#FFA500', // Orange
  '#9B59B6', // Purple
  '#3498DB', // Light Blue
  '#E74C3C', // Coral
  '#F39C12', // Gold
];

export function ArtistComparison({
  streamingHistory,
  startDate,
  endDate,
  onClose,
  initialArtists = [],
  availableArtists,
}: ArtistComparisonProps) {
  const [selectedArtists, setSelectedArtists] = useState<string[]>(
    initialArtists.slice(0, 5)
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Configure Fuse.js for fuzzy search
  const artistFuse = useMemo(
    () =>
      new Fuse(availableArtists, {
        keys: ['name'],
        threshold: 0.3,
        distance: 100,
        minMatchCharLength: 1,
      }),
    [availableArtists]
  );

  // Filter and sort available artists based on search
  const filteredArtists = useMemo(() => {
    // Filter out already selected artists
    const unselectedArtists = availableArtists.filter(
      artist => !selectedArtists.includes(artist.name)
    );

    // If no search term, return sorted by the centralized sorting logic (by time)
    if (!searchTerm.trim()) {
      return sortArtists(unselectedArtists).slice(0, 20);
    }

    // Use fuzzy search
    const results = artistFuse.search(searchTerm);
    return results
      .map(result => result.item)
      .filter(artist => !selectedArtists.includes(artist.name))
      .slice(0, 20);
  }, [availableArtists, selectedArtists, searchTerm, artistFuse]);

  // Calculate data for all selected artists
  const chartData = useMemo(() => {
    // First, collect all months
    const monthsSet = new Set<string>();
    const artistData = new Map<string, Map<string, number>>();

    // Initialize data structures for each artist
    selectedArtists.forEach(artist => {
      artistData.set(artist, new Map());
    });

    // Process streaming history
    streamingHistory.forEach(entry => {
      if (!selectedArtists.includes(entry.artistName)) return;

      const entryDate = new Date(entry.endTime);
      const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Date range filter
      if (startDate && monthKey < startDate) return;
      if (endDate && monthKey > endDate) return;

      monthsSet.add(monthKey);

      const artistMap = artistData.get(entry.artistName)!;
      const currentMinutes = artistMap.get(monthKey) || 0;
      artistMap.set(monthKey, currentMinutes + (entry.msPlayed / 1000 / 60));
    });

    // Convert to array format for Recharts
    const sortedMonths = Array.from(monthsSet).sort();
    
    return sortedMonths.map(month => {
      const dataPoint: any = {
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        }),
      };

      selectedArtists.forEach(artist => {
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
    }
  };

  const removeArtist = (artist: string) => {
    setSelectedArtists(selectedArtists.filter(a => a !== artist));
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col border-green-500/30 bg-black/90">
        <CardHeader className="border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-transparent flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-2xl mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Artist Comparison
              </CardTitle>
              <p className="text-sm text-white/60">
                Compare listening patterns across multiple artists
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Artist Selection */}
            <div>
              <h3 className="text-white font-semibold mb-3">Selected Artists ({selectedArtists.length}/8)</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedArtists.map((artist, index) => (
                  <div
                    key={artist}
                    className="flex items-center gap-2 bg-white/5 border rounded-lg px-3 py-2 hover:border-green-500/30 transition-colors"
                    style={{ borderColor: `${COLORS[index]}40` }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-white">{artist}</span>
                    <button
                      onClick={() => removeArtist(artist)}
                      className="p-0.5 rounded hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-white/60" />
                    </button>
                  </div>
                ))}
              </div>

              {selectedArtists.length < 8 && (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for an artist to add... (supports fuzzy search)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      autoComplete="off"
                    />
                  </div>
                  {(searchTerm || filteredArtists.length > 0) && (
                    <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg max-h-60 overflow-y-auto custom-scrollbar">
                      {filteredArtists.length > 0 ? (
                        filteredArtists.map(artist => (
                          <button
                            key={artist.name}
                            onClick={() => addArtist(artist.name)}
                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs font-semibold text-green-400 w-8 text-center flex-shrink-0">
                                #{artist.rank}
                              </span>
                              <span className="truncate">{artist.name}</span>
                            </div>
                            <div className="text-xs text-white/40 ml-2 flex-shrink-0">
                              {formatNumber(msToMinutes(artist.totalTime))} min
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-sm text-white/40 text-center">
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
                <h3 className="text-white font-semibold mb-3">Listening Activity Over Time</h3>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="month"
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '11px' }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '11px' }}
                        label={{ 
                          value: 'Minutes', 
                          angle: -90, 
                          position: 'insideLeft', 
                          fill: 'rgba(255,255,255,0.7)',
                          style: { fontSize: '11px' }
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.95)',
                          border: '1px solid rgba(29, 185, 84, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '12px'
                        }}
                        formatter={(value: number) => [`${value} min`, '']}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconType="line"
                      />
                      {selectedArtists.map((artist, index) => (
                        <Line
                          key={artist}
                          type="monotone"
                          dataKey={artist}
                          stroke={COLORS[index]}
                          strokeWidth={2.5}
                          dot={{ fill: COLORS[index], r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/60 bg-white/5 rounded-lg border border-white/10">
                {selectedArtists.length === 0 
                  ? 'Add artists to start comparing their listening patterns'
                  : 'No listening data available for the selected date range'
                }
              </div>
            )}

            {/* Summary Stats */}
            {selectedArtists.length > 0 && chartData.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Total Listening Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedArtists.map((artist, index) => {
                    const totalMinutes = chartData.reduce((sum, month) => sum + (month[artist] || 0), 0);
                    return (
                      <div
                        key={artist}
                        className="bg-white/5 border rounded-lg p-3 hover:border-opacity-100 transition-colors"
                        style={{ borderColor: `${COLORS[index]}40` }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: COLORS[index] }}
                          />
                          <p className="text-xs text-white/60 truncate">{artist}</p>
                        </div>
                        <p className="text-lg font-bold text-white">{totalMinutes.toLocaleString()} min</p>
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

