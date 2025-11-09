import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Calendar, Music, Headphones, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { useSpotifyData } from '@/hooks';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

// CONFIGURABLE THRESHOLDS - Easy to adjust
const DISCOVERY_CONFIG = {
  MIN_WEEKS_DURATION: 4,        // Minimum weeks to track (4 weeks = 1 month)
  MIN_PLAYS_PER_WEEK: 1,        // Minimum plays per week
  MIN_TOTAL_PLAYS: 5,           // Minimum total plays in the period
};

interface DiscoveryItem {
  name: string;
  type: 'artist' | 'track';
  firstPlayed: Date;
  totalPlays: number;
  weeksActive: number;
  artist?: string; // For tracks
  monthYear: string;
}

export function DiscoveryTimeline() {
  const { streamingHistory, stats } = useSpotifyData();
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [showType, setShowType] = useState<'all' | 'artists' | 'tracks'>('all');

  const discoveryData = useMemo(() => {
    if (!streamingHistory || streamingHistory.length === 0) return [];

    // Track first occurrence and weekly plays for each artist/track
    const itemTracking = new Map<string, {
      name: string;
      type: 'artist' | 'track';
      artist?: string;
      firstPlayed: Date;
      weeklyPlays: Map<string, number>;
    }>();

    // Sort by oldest first
    const sortedHistory = [...streamingHistory].sort(
      (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
    );

    sortedHistory.forEach(entry => {
      const artistKey = `artist:${entry.artistName}`;
      const trackKey = `track:${entry.trackName}|||${entry.artistName}`;
      const date = new Date(entry.endTime);
      
      // Get week key (year + week number)
      const weekKey = getWeekKey(date);

      // Track artist
      if (!itemTracking.has(artistKey)) {
        itemTracking.set(artistKey, {
          name: entry.artistName,
          type: 'artist',
          firstPlayed: date,
          weeklyPlays: new Map([[weekKey, 1]]),
        });
      } else {
        const item = itemTracking.get(artistKey)!;
        item.weeklyPlays.set(weekKey, (item.weeklyPlays.get(weekKey) || 0) + 1);
      }

      // Track track
      if (!itemTracking.has(trackKey)) {
        itemTracking.set(trackKey, {
          name: entry.trackName,
          type: 'track',
          artist: entry.artistName,
          firstPlayed: date,
          weeklyPlays: new Map([[weekKey, 1]]),
        });
      } else {
        const item = itemTracking.get(trackKey)!;
        item.weeklyPlays.set(weekKey, (item.weeklyPlays.get(weekKey) || 0) + 1);
      }
    });

    // Filter based on consistency criteria
    const qualifiedItems: DiscoveryItem[] = [];

    itemTracking.forEach((item) => {
      const totalPlays = Array.from(item.weeklyPlays.values()).reduce((sum, plays) => sum + plays, 0);
      const weeksActive = item.weeklyPlays.size;
      
      // Check if item meets consistency criteria
      const meetsMinimumWeeks = weeksActive >= DISCOVERY_CONFIG.MIN_WEEKS_DURATION;
      const meetsMinimumPlays = totalPlays >= DISCOVERY_CONFIG.MIN_TOTAL_PLAYS;
      
      // Check if item was played consistently (at least MIN_PLAYS_PER_WEEK in most weeks)
      let qualifiedWeeks = 0;
      item.weeklyPlays.forEach(plays => {
        if (plays >= DISCOVERY_CONFIG.MIN_PLAYS_PER_WEEK) {
          qualifiedWeeks++;
        }
      });
      const consistentEnough = qualifiedWeeks >= DISCOVERY_CONFIG.MIN_WEEKS_DURATION;

      if (meetsMinimumWeeks && meetsMinimumPlays && consistentEnough) {
        const monthYear = item.firstPlayed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        qualifiedItems.push({
          name: item.name,
          type: item.type,
          artist: item.artist,
          firstPlayed: item.firstPlayed,
          totalPlays,
          weeksActive,
          monthYear,
        });
      }
    });

    return qualifiedItems.sort((a, b) => b.firstPlayed.getTime() - a.firstPlayed.getTime());
  }, [streamingHistory]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const grouped = new Map<string, DiscoveryItem[]>();

    discoveryData
      .filter(item => {
        if (showType === 'all') return true;
        if (showType === 'artists') return item.type === 'artist';
        return item.type === 'track';
      })
      .forEach(item => {
        if (!grouped.has(item.monthYear)) {
          grouped.set(item.monthYear, []);
        }
        grouped.get(item.monthYear)!.push(item);
      });

    return Array.from(grouped.entries())
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateB.getTime() - dateA.getTime();
      });
  }, [discoveryData, showType]);

  const toggleMonth = (monthYear: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthYear)) {
      newExpanded.delete(monthYear);
    } else {
      newExpanded.add(monthYear);
    }
    setExpandedMonths(newExpanded);
  };

  if (!stats || discoveryData.length === 0) {
    return (
      <Card className="bg-black/40 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-400" />
            Discovery Timeline
          </CardTitle>
          <CardDescription className="text-white/60">
            Artists and tracks you listened to consistently (at least {DISCOVERY_CONFIG.MIN_PLAYS_PER_WEEK}x/week for {DISCOVERY_CONFIG.MIN_WEEKS_DURATION}+ weeks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-white/40">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No consistently listened music found in your history</p>
            <p className="text-sm mt-2">This shows artists and tracks you listened to regularly, not one-time plays</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalArtists = discoveryData.filter(d => d.type === 'artist').length;
  const totalTracks = discoveryData.filter(d => d.type === 'track').length;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-purple-400" />
              Discovery Timeline
            </CardTitle>
            <CardDescription className="text-white/60 mt-2">
              Artists and tracks you listened to consistently (at least {DISCOVERY_CONFIG.MIN_PLAYS_PER_WEEK}x/week for {DISCOVERY_CONFIG.MIN_WEEKS_DURATION}+ weeks)
            </CardDescription>
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border-green-500/30">
                <Headphones className="w-3 h-3 mr-1" />
                {formatNumber(totalArtists)} Artists
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border-blue-500/30">
                <Music className="w-3 h-3 mr-1" />
                {formatNumber(totalTracks)} Tracks
              </Badge>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <Button
              variant={showType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowType('all')}
              className={cn(
                'gap-2',
                showType === 'all'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white border-white/20 hover:bg-white/10'
              )}
            >
              <Sparkles className="h-4 w-4" />
              All
            </Button>
            <Button
              variant={showType === 'artists' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowType('artists')}
              className={cn(
                'gap-2',
                showType === 'artists'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'text-white/70 hover:text-white border-white/20 hover:bg-white/10'
              )}
            >
              <Headphones className="h-4 w-4" />
              Artists
            </Button>
            <Button
              variant={showType === 'tracks' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowType('tracks')}
              className={cn(
                'gap-2',
                showType === 'tracks'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white border-white/20 hover:bg-white/10'
              )}
            >
              <Music className="h-4 w-4" />
              Tracks
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {groupedByMonth.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No discoveries found in selected category</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {groupedByMonth.map(([monthYear, items]) => {
              const isExpanded = expandedMonths.has(monthYear);
              const displayItems = isExpanded ? items : items.slice(0, 5);
              const hasMore = items.length > 5;

              return (
                <div
                  key={monthYear}
                  className="border-l-2 border-purple-500/30 pl-6 relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 w-3 h-3 bg-purple-500 rounded-full -translate-x-[7px] ring-4 ring-black/40" />

                  {/* Month header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <h3 className="font-bold text-white">{monthYear}</h3>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {items.length} consistent
                      </Badge>
                    </div>
                  </div>

                  {/* Discoveries */}
                  <div className="space-y-2 mb-3">
                    {displayItems.map((item, index) => (
                      <div
                        key={`${item.type}-${item.name}-${index}`}
                        className={cn(
                          'rounded-lg p-3 border-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer',
                          item.type === 'artist'
                            ? 'bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20 hover:border-green-500/40'
                            : 'bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border-blue-500/20 hover:border-blue-500/40'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {item.type === 'artist' ? (
                              <Headphones className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Music className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white truncate">
                                {item.name}
                              </p>
                              {item.artist && (
                                <p className="text-xs text-white/60 truncate">
                                  {item.artist}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-xs text-white/40">
                                  {item.firstPlayed.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <p className="text-xs text-white/60 flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  {formatNumber(item.totalPlays)} plays
                                </p>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <p className="text-xs text-white/60">
                                  {item.weeksActive} weeks active
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show more button */}
                  {hasMore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMonth(monthYear)}
                      className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show {items.length - 5} More
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get week key (year-weekNumber)
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const daysSinceStart = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNumber}`;
}
