import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Calendar, Music, Headphones, ChevronDown, ChevronUp } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';
import { formatNumber } from '@/shared/utils';
import { cn } from '@/shared/utils';

// CONFIGURABLE THRESHOLDS - Easy to adjust
const DISCOVERY_CONFIG = {
  MIN_WEEKS_DURATION: 4, // Minimum weeks to track (4 weeks = 1 month)
  MIN_PLAYS_PER_WEEK: 3, // Minimum plays per week
  MIN_TOTAL_PLAYS: 5, // Minimum total plays in the period
  MIN_STREAM_DURATION_MS: 60000, // Minimum stream duration (60000ms = 1 minute)
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
  const [showType, setShowType] = useState<'artists' | 'tracks'>('artists');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const discoveryData = useMemo(() => {
    if (!streamingHistory || streamingHistory.length === 0) return [];

    // Track first occurrence and weekly plays for each artist/track
    const itemTracking = new Map<
      string,
      {
        name: string;
        type: 'artist' | 'track';
        artist?: string;
        firstPlayed: Date;
        weeklyPlays: Map<string, number>;
      }
    >();

    // Sort by oldest first
    const sortedHistory = [...streamingHistory].sort(
      (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
    );

    sortedHistory.forEach((entry) => {
      // Only consider streams that meet minimum duration
      if (entry.msPlayed < DISCOVERY_CONFIG.MIN_STREAM_DURATION_MS) {
        return; // Skip this entry
      }

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
      const totalPlays = Array.from(item.weeklyPlays.values()).reduce(
        (sum, plays) => sum + plays,
        0
      );
      const weeksActive = item.weeklyPlays.size;

      // Check if item meets consistency criteria
      const meetsMinimumWeeks = weeksActive >= DISCOVERY_CONFIG.MIN_WEEKS_DURATION;
      const meetsMinimumPlays = totalPlays >= DISCOVERY_CONFIG.MIN_TOTAL_PLAYS;

      // Check if item was played consistently (at least MIN_PLAYS_PER_WEEK in most weeks)
      let qualifiedWeeks = 0;
      item.weeklyPlays.forEach((plays) => {
        if (plays >= DISCOVERY_CONFIG.MIN_PLAYS_PER_WEEK) {
          qualifiedWeeks++;
        }
      });
      const consistentEnough = qualifiedWeeks >= DISCOVERY_CONFIG.MIN_WEEKS_DURATION;

      if (meetsMinimumWeeks && meetsMinimumPlays && consistentEnough) {
        const monthYear = item.firstPlayed.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });

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

  // Get available years from discovery data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    discoveryData.forEach((item) => {
      years.add(item.firstPlayed.getFullYear().toString());
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  }, [discoveryData]);

  // Set default year to current year if available
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    if (availableYears.length > 0 && selectedYear === 'all') {
      const defaultYear = availableYears.includes(currentYear) ? currentYear : availableYears[0];
      setSelectedYear(defaultYear);
    }
  }, [availableYears]);

  // Group by month and filter by year
  const groupedByMonth = useMemo(() => {
    const grouped = new Map<string, DiscoveryItem[]>();

    discoveryData
      .filter((item) => {
        // Filter by type
        const typeMatch = showType === 'artists' ? item.type === 'artist' : item.type === 'track';
        // Filter by year
        const yearMatch =
          selectedYear === 'all' || item.firstPlayed.getFullYear().toString() === selectedYear;
        return typeMatch && yearMatch;
      })
      .forEach((item) => {
        if (!grouped.has(item.monthYear)) {
          grouped.set(item.monthYear, []);
        }
        grouped.get(item.monthYear)!.push(item);
      });

    // Sort items within each month by play count (most played first)
    grouped.forEach((items) => {
      items.sort((a, b) => b.totalPlays - a.totalPlays);
    });

    return Array.from(grouped.entries()).sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateB.getTime() - dateA.getTime();
    });
  }, [discoveryData, showType, selectedYear]);

  // Calculate totals based on current filters
  const totalArtists = useMemo(
    () =>
      discoveryData.filter((d) => {
        const typeMatch = d.type === 'artist';
        const yearMatch =
          selectedYear === 'all' || d.firstPlayed.getFullYear().toString() === selectedYear;
        return typeMatch && yearMatch;
      }).length,
    [discoveryData, selectedYear]
  );

  const totalTracks = useMemo(
    () =>
      discoveryData.filter((d) => {
        const typeMatch = d.type === 'track';
        const yearMatch =
          selectedYear === 'all' || d.firstPlayed.getFullYear().toString() === selectedYear;
        return typeMatch && yearMatch;
      }).length,
    [discoveryData, selectedYear]
  );

  const toggleMonth = (monthYear: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthYear)) {
      newExpanded.delete(monthYear);
    } else {
      newExpanded.add(monthYear);
    }
    setExpandedMonths(newExpanded);
  };

  const segment = (active: boolean) =>
    `h-8 px-3 inline-flex items-center gap-1.5 text-sm font-medium tabular-nums transition-colors border-r border-input last:border-r-0 whitespace-nowrap ${
      active
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
    }`;

  if (!stats || discoveryData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 border border-dashed border-input">
            <p className="font-medium">No consistently listened music found in your history</p>
            <p className="text-sm text-muted-foreground mt-2">
              This shows artists and tracks you listened to regularly, not one-time plays
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <dl className="flex gap-6">
            <div className="flex flex-col">
              <dt className="label-caps mt-1 order-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-code-green" aria-hidden />
                Artists
              </dt>
              <dd className="order-1 text-2xl font-medium tabular-nums">
                {formatNumber(totalArtists)}
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="label-caps mt-1 order-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-code-blue" aria-hidden />
                Tracks
              </dt>
              <dd className="order-1 text-2xl font-medium tabular-nums">
                {formatNumber(totalTracks)}
              </dd>
            </div>
          </dl>

          <div className="flex gap-3 flex-wrap">
            <div role="group" aria-label="Show" className="flex border border-input">
              <button
                onClick={() => setShowType('artists')}
                aria-pressed={showType === 'artists'}
                className={segment(showType === 'artists')}
              >
                <Headphones className="h-4 w-4" aria-hidden />
                Artists
              </button>
              <button
                onClick={() => setShowType('tracks')}
                aria-pressed={showType === 'tracks'}
                className={segment(showType === 'tracks')}
              >
                <Music className="h-4 w-4" aria-hidden />
                Tracks
              </button>
            </div>

            {availableYears.length > 1 && (
              <div
                role="group"
                aria-label="Year"
                className="flex border border-input overflow-x-auto scrollbar-hide max-w-full"
              >
                <button
                  onClick={() => setSelectedYear('all')}
                  aria-pressed={selectedYear === 'all'}
                  className={segment(selectedYear === 'all')}
                >
                  <Calendar className="h-4 w-4" aria-hidden />
                  All Years
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    aria-pressed={selectedYear === year}
                    className={segment(selectedYear === year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {groupedByMonth.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-input text-muted-foreground">
            <p>No discoveries found in selected category</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {groupedByMonth.map(([monthYear, items]) => {
              const isExpanded = expandedMonths.has(monthYear);
              const displayItems = isExpanded ? items : items.slice(0, 5);
              const hasMore = items.length > 5;

              return (
                <div key={monthYear} className="border-l border-input pl-4 relative">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-foreground -translate-x-[4.5px]" />

                  <div className="flex items-baseline gap-3 mb-1">
                    <h4 className="font-semibold">{monthYear}</h4>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {items.length} consistent
                    </span>
                  </div>

                  <ul className="border-t border-border mb-2">
                    {displayItems.map((item, index) => (
                      <li
                        key={`${item.type}-${item.name}-${index}`}
                        className="flex items-start gap-3 py-2.5 border-b border-border"
                      >
                        <span
                          className={cn(
                            'h-2.5 w-2.5 flex-shrink-0 mt-1.5',
                            item.type === 'artist' ? 'bg-code-green' : 'bg-code-blue'
                          )}
                          role="img"
                          aria-label={item.type === 'artist' ? 'Artist' : 'Track'}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.name}</p>
                          {item.artist && (
                            <p className="text-xs text-muted-foreground truncate">{item.artist}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                            {item.firstPlayed.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            {' · '}
                            {formatNumber(item.totalPlays)} plays
                            {' · '}
                            {item.weeksActive} weeks active
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {hasMore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleMonth(monthYear)}
                      className="w-full text-primary hover:text-primary"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" aria-hidden />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" aria-hidden />
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
  const daysSinceStart = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const weekNumber = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);
  return `${year}-W${weekNumber}`;
}
