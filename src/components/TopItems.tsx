import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProcessedStats, StreamingHistoryEntry } from '@/types/spotify';
import { formatNumber, msToMinutes } from '@/lib/utils';
import { Music2, Trophy, ChevronLeft, ChevronRight, Search, X, TrendingUp, BarChart3 } from 'lucide-react';
import { ItemTimeline } from './ItemTimeline';
import { ArtistComparison } from './ArtistComparison';
import { TrackComparison } from './TrackComparison';

interface TopItemsProps {
  stats: ProcessedStats;
  streamingHistory: StreamingHistoryEntry[];
  startDate: string;
  endDate: string;
  sortBy: 'time' | 'plays';
}

const ITEMS_PER_PAGE = 10;

export function TopItems({ stats, streamingHistory, startDate, endDate, sortBy }: TopItemsProps) {
  const [artistPage, setArtistPage] = useState(1);
  const [trackPage, setTrackPage] = useState(1);
  const [artistSearch, setArtistSearch] = useState('');
  const [trackSearch, setTrackSearch] = useState('');
  const [artistPageInput, setArtistPageInput] = useState('1');
  const [trackPageInput, setTrackPageInput] = useState('1');
  
  // Timeline modal state
  const [timelineItem, setTimelineItem] = useState<{
    name: string;
    type: 'artist' | 'track';
    artistName?: string;
  } | null>(null);
  
  // Comparison modal state
  const [showComparison, setShowComparison] = useState(false);
  const [showTrackComparison, setShowTrackComparison] = useState(false);

  // Sort artists and tracks based on global sortBy
  const sortedArtists = useMemo(() => {
    if (sortBy === 'plays') {
      return [...stats.topArtists].sort((a, b) => b.playCount - a.playCount);
    }
    // Default: sort by time (totalTime in ms)
    return [...stats.topArtists].sort((a, b) => b.totalTime - a.totalTime);
  }, [stats.topArtists, sortBy]);

  const sortedTracks = useMemo(() => {
    if (sortBy === 'plays') {
      return [...stats.topTracks].sort((a, b) => b.playCount - a.playCount);
    }
    // Default: sort by time (totalMs)
    return [...stats.topTracks].sort((a, b) => b.totalMs - a.totalMs);
  }, [stats.topTracks, sortBy]);

  // Configure Fuse.js for fuzzy search on artists
  const artistFuse = useMemo(
    () =>
      new Fuse(sortedArtists, {
        keys: ['name'],
        threshold: 0.4, // 0 = perfect match, 1 = match anything
        distance: 100,
        minMatchCharLength: 2,
      }),
    [sortedArtists]
  );

  // Configure Fuse.js for fuzzy search on tracks
  const trackFuse = useMemo(
    () =>
      new Fuse(sortedTracks, {
        keys: ['name', 'artist'],
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 2,
      }),
    [sortedTracks]
  );

  // Filter artists based on fuzzy search
  const filteredArtists = useMemo(() => {
    if (!artistSearch.trim()) return sortedArtists;
    const results = artistFuse.search(artistSearch);
    return results.map((result) => result.item);
  }, [sortedArtists, artistSearch, artistFuse]);

  // Filter tracks based on fuzzy search
  const filteredTracks = useMemo(() => {
    if (!trackSearch.trim()) return sortedTracks;
    const results = trackFuse.search(trackSearch);
    return results.map((result) => result.item);
  }, [sortedTracks, trackSearch, trackFuse]);

  // Reset to page 1 when search changes
  useMemo(() => {
    setArtistPage(1);
  }, [artistSearch]);

  useMemo(() => {
    setTrackPage(1);
  }, [trackSearch]);

  const totalArtistPages = Math.ceil(filteredArtists.length / ITEMS_PER_PAGE);
  const totalTrackPages = Math.ceil(filteredTracks.length / ITEMS_PER_PAGE);

  const paginatedArtists = filteredArtists.slice(
    (artistPage - 1) * ITEMS_PER_PAGE,
    artistPage * ITEMS_PER_PAGE
  );

  const paginatedTracks = filteredTracks.slice(
    (trackPage - 1) * ITEMS_PER_PAGE,
    trackPage * ITEMS_PER_PAGE
  );

  // Handle artist page jump
  const handleArtistPageJump = (value: string) => {
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalArtistPages) {
      setArtistPage(pageNum);
      setArtistPageInput(pageNum.toString());
    } else {
      setArtistPageInput(artistPage.toString());
    }
  };

  // Handle track page jump
  const handleTrackPageJump = (value: string) => {
    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalTrackPages) {
      setTrackPage(pageNum);
      setTrackPageInput(pageNum.toString());
    } else {
      setTrackPageInput(trackPage.toString());
    }
  };

  // Update page input when page changes via buttons
  useMemo(() => {
    setArtistPageInput(artistPage.toString());
  }, [artistPage]);

  useMemo(() => {
    setTrackPageInput(trackPage.toString());
  }, [trackPage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Artists */}
      <Card className="overflow-hidden border-green-500/30">
        <CardHeader className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-b border-green-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="w-5 h-5 text-green-400" />
              Your Top Artists
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComparison(true)}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Compare Artists
              </Button>
              <div className="w-px h-6 bg-white/10" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setArtistPage((p) => Math.max(1, p - 1))}
                disabled={artistPage === 1}
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm text-white/60 min-w-[80px] justify-center">
                <input
                  type="text"
                  value={artistPageInput}
                  onChange={(e) => setArtistPageInput(e.target.value)}
                  onBlur={(e) => handleArtistPageJump(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleArtistPageJump(artistPageInput);
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-8 text-center bg-white/5 border border-white/10 rounded px-1 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50"
                />
                <span>/</span>
                <span>{totalArtistPages}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setArtistPage((p) => Math.min(totalArtistPages, p + 1))}
                disabled={artistPage === totalArtistPages}
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search artists..."
              value={artistSearch}
              onChange={(e) => setArtistSearch(e.target.value)}
              className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-green-500/50"
            />
            {artistSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setArtistSearch('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-12 text-white/60">#</TableHead>
                <TableHead className="text-white/60">Artist</TableHead>
                <TableHead className="text-right text-white/60">Plays</TableHead>
                <TableHead className="text-right text-white/60">Minutes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArtists.length > 0 ? (
                paginatedArtists.map((artist) => {
                  const actualIndex = sortedArtists.findIndex(a => a.name === artist.name);
                  return (
                    <TableRow 
                      key={actualIndex} 
                      className="hover:bg-white/5 border-white/5 cursor-pointer group"
                      onClick={() => setTimelineItem({ name: artist.name, type: 'artist' })}
                    >
                      <TableCell className="font-bold text-white/40">
                        {actualIndex + 1}
                      </TableCell>
                      <TableCell className="font-medium text-white group-hover:text-green-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <Music2 className="w-4 h-4 text-green-400" />
                          <span className="truncate">{artist.name}</span>
                          <TrendingUp className="w-4 h-4 text-green-400/60 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="border-green-500/30 text-green-300">
                          {formatNumber(artist.playCount)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                          {formatNumber(msToMinutes(artist.totalMs))} min
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-white/40 py-8">
                    No artists found matching "{artistSearch}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Tracks */}
      <Card className="overflow-hidden border-blue-500/30">
        <CardHeader className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-b border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Music2 className="w-5 h-5 text-blue-400" />
              Your Top Tracks
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTrackComparison(true)}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Compare Tracks
              </Button>
              <div className="w-px h-6 bg-white/10" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTrackPage((p) => Math.max(1, p - 1))}
                disabled={trackPage === 1}
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-sm text-white/60 min-w-[80px] justify-center">
                <input
                  type="text"
                  value={trackPageInput}
                  onChange={(e) => setTrackPageInput(e.target.value)}
                  onBlur={(e) => handleTrackPageJump(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTrackPageJump(trackPageInput);
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-8 text-center bg-white/5 border border-white/10 rounded px-1 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
                <span>/</span>
                <span>{totalTrackPages}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTrackPage((p) => Math.min(totalTrackPages, p + 1))}
                disabled={trackPage === totalTrackPages}
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search tracks or artists..."
              value={trackSearch}
              onChange={(e) => setTrackSearch(e.target.value)}
              className="pl-9 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500/50"
            />
            {trackSearch && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTrackSearch('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="w-12 text-white/60">#</TableHead>
                <TableHead className="text-white/60">Track</TableHead>
                <TableHead className="text-white/60">Artist</TableHead>
                <TableHead className="text-right text-white/60">Plays</TableHead>
                <TableHead className="text-right text-white/60">Minutes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTracks.length > 0 ? (
                paginatedTracks.map((track) => {
                  const actualIndex = sortedTracks.findIndex(
                    t => t.name === track.name && t.artist === track.artist
                  );
                  return (
                    <TableRow 
                      key={actualIndex} 
                      className="hover:bg-white/5 border-white/5 cursor-pointer group"
                      onClick={() => setTimelineItem({ name: track.name, type: 'track', artistName: track.artist })}
                    >
                      <TableCell className="font-bold text-white/40">
                        {actualIndex + 1}
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] text-white group-hover:text-green-300 transition-colors flex items-center gap-2">
                        <span className="truncate">{track.name}</span>
                        <TrendingUp className="w-4 h-4 text-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </TableCell>
                      <TableCell className="text-sm text-white/60 max-w-[150px] truncate">
                        {track.artist}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                          {formatNumber(track.playCount)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {formatNumber(msToMinutes(track.totalMs))} min
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-white/40 py-8">
                    No tracks found matching "{trackSearch}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Timeline Modal */}
      {timelineItem && (
        <ItemTimeline
          itemName={timelineItem.name}
          itemType={timelineItem.type}
          artistName={timelineItem.artistName}
          streamingHistory={streamingHistory}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setTimelineItem(null)}
        />
      )}

      {/* Artist Comparison Modal */}
      {showComparison && (
        <ArtistComparison
          key={`artist-comparison-${sortBy}`}
          streamingHistory={streamingHistory}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setShowComparison(false)}
          availableArtists={sortedArtists.map((a, index) => ({
            name: a.name,
            playCount: a.playCount,
            totalTime: a.totalTime,
            totalMs: a.totalMs,
            rank: index + 1
          }))}
          initialArtists={sortedArtists.slice(0, 3).map(a => a.name)}
        />
      )}

      {/* Track Comparison Modal */}
      {showTrackComparison && (
        <TrackComparison
          key={`track-comparison-${sortBy}`}
          streamingHistory={streamingHistory}
          startDate={startDate}
          endDate={endDate}
          onClose={() => setShowTrackComparison(false)}
          availableTracks={sortedTracks.map((t, index) => ({
            name: t.name,
            artist: t.artist,
            playCount: t.playCount,
            totalMs: t.totalMs,
            rank: index + 1
          }))}
          initialTracks={sortedTracks.slice(0, 3).map(t => ({ name: t.name, artist: t.artist }))}
        />
      )}
    </div>
  );
}

