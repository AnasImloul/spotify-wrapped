import { X, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { StreamingHistoryEntry } from '@/types/spotify';

interface ItemTimelineProps {
  itemName: string;
  itemType: 'artist' | 'track';
  artistName?: string; // For tracks
  streamingHistory: StreamingHistoryEntry[];
  startDate: string;
  endDate: string;
  onClose: () => void;
}

export function ItemTimeline({
  itemName,
  itemType,
  artistName,
  streamingHistory,
  startDate,
  endDate,
  onClose,
}: ItemTimelineProps) {
  // Filter entries for this specific item
  const filteredEntries = streamingHistory.filter((entry) => {
    const entryDate = new Date(entry.endTime);
    const entryYearMonth = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Date range filter
    if (startDate && entryYearMonth < startDate) return false;
    if (endDate && entryYearMonth > endDate) return false;
    
    // Item filter
    if (itemType === 'artist') {
      return entry.artistName === itemName;
    } else {
      return entry.trackName === itemName && entry.artistName === artistName;
    }
  });

  // Group by month
  const monthlyData = filteredEntries.reduce((acc, entry) => {
    const date = new Date(entry.endTime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        plays: 0,
        totalMinutes: 0,
      };
    }
    
    acc[monthKey].plays += 1;
    acc[monthKey].totalMinutes += entry.msPlayed / 1000 / 60;
    
    return acc;
  }, {} as Record<string, { month: string; plays: number; totalMinutes: number }>);

  // Convert to array and sort by month
  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      minutes: Math.round(item.totalMinutes),
      plays: item.plays,
    }));

  const totalPlays = filteredEntries.length;
  const totalMinutes = Math.round(filteredEntries.reduce((sum, e) => sum + e.msPlayed / 1000 / 60, 0));

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-4xl h-[85vh] flex flex-col border-green-500/30 bg-black/90">
        <CardHeader className="border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-transparent flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-2xl mb-2 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Listening Timeline
              </CardTitle>
              <div className="space-y-1">
                <p className="text-lg text-white font-semibold">{itemName}</p>
                {artistName && itemType === 'track' && (
                  <p className="text-sm text-white/60">by {artistName}</p>
                )}
              </div>
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
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-green-300/80 mb-1">Total Plays</p>
                <p className="text-3xl font-bold text-white">{totalPlays.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-300/80 mb-1">Total Minutes</p>
                <p className="text-3xl font-bold text-white">{totalMinutes.toLocaleString()}</p>
              </div>
            </div>

            {/* Chart */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Listening Activity Over Time</h3>
              {chartData.length > 0 ? (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="month"
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '12px' }}
                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          border: '1px solid rgba(29, 185, 84, 0.3)',
                          borderRadius: '8px',
                          color: 'white',
                        }}
                        formatter={(value: number, name: string) => [
                          name === 'minutes' ? `${value} min` : value,
                          name === 'minutes' ? 'Listening Time' : 'Plays'
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke="#1DB954"
                        strokeWidth={3}
                        dot={{ fill: '#1DB954', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12 text-white/60">
                  No listening data available for the selected date range
                </div>
              )}
            </div>

            {/* Monthly Breakdown */}
            {chartData.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3 text-lg">Monthly Breakdown</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {chartData.map((item) => (
                    <div
                      key={item.month}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-green-500/30 transition-colors"
                    >
                      <p className="text-xs text-white/60 mb-1 truncate">{item.month}</p>
                      <p className="text-base font-bold text-white">{item.minutes} min</p>
                      <p className="text-xs text-green-400">{item.plays} plays</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

