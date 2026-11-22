import { useState, useMemo, type KeyboardEvent } from 'react';
import Fuse from 'fuse.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { formatNumber, msToMinutes } from '@/shared/utils';
import { ChevronLeft, ChevronRight, Search, X, TrendingUp, BarChart3 } from 'lucide-react';
import { ItemTimeline } from './ItemTimeline';
import { ArtistComparison } from './ArtistComparison';
import { TrackComparison } from './TrackComparison';
import { useSortedArtists, useSortedTracks } from '@/shared/hooks';

const ITEMS_PER_PAGE = 10;

interface PanelHeaderProps {
  title: string;
  compareLabel: string;
  onCompare: () => void;
  page: number;
  totalPages: number;
  pageInput: string;
  onPageInputChange: (value: string) => void;
  onPageJump: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
}

function PanelHeader({
  title,
  compareLabel,
  onCompare,
  page,
  totalPages,
  pageInput,
  onPageInputChange,
  onPageJump,
  onPrev,
  onNext,
  search,
  onSearchChange,
  searchPlaceholder,
}: PanelHeaderProps) {
  return (
    <div className="space-y-3 px-4 pt-4 pb-3 border-b border-foreground">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <h4 className="text-lg font-semibold whitespace-nowrap">{title}</h4>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCompare}
            className="text-primary hover:text-primary"
          >
            <BarChart3 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{compareLabel}</span>
            <span className="sm:hidden">Compare</span>
          </Button>
          <div className="w-px h-5 bg-border mx-1" aria-hidden />
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            disabled={page === 1}
            aria-label={`Previous page of ${title.toLowerCase()}`}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
            <input
              type="text"
              inputMode="numeric"
              aria-label={`Page of ${title.toLowerCase()}`}
              value={pageInput}
              onChange={(e) => onPageInputChange(e.target.value)}
              onBlur={(e) => onPageJump(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onPageJump(pageInput);
                  e.currentTarget.blur();
                }
              }}
              className="w-9 h-7 text-center bg-transparent border border-input text-foreground focus:border-primary focus:outline-none"
            />
            <span aria-hidden>/</span>
            <span>{totalPages}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={page === totalPages}
            aria-label={`Next page of ${title.toLowerCase()}`}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder.replace('...', '')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 h-9 bg-transparent border-input placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

const rowClass =
  'border-border cursor-pointer group focus-visible:outline-none focus-visible:bg-white/[0.05] focus-visible:shadow-[inset_2px_0_0_hsl(var(--primary))]';
const openOnKey = (open: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open();
  }
};

export function TopItems() {
  const sortedArtists = useSortedArtists();
  const sortedTracks = useSortedTracks();
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

  const totalArtistPages = Math.max(1, Math.ceil(filteredArtists.length / ITEMS_PER_PAGE));
  const totalTrackPages = Math.max(1, Math.ceil(filteredTracks.length / ITEMS_PER_PAGE));

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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
      <section aria-label="Top artists" className="border border-border bg-card">
        <PanelHeader
          title="Top artists"
          compareLabel="Compare artists"
          onCompare={() => setShowComparison(true)}
          page={artistPage}
          totalPages={totalArtistPages}
          pageInput={artistPageInput}
          onPageInputChange={setArtistPageInput}
          onPageJump={handleArtistPageJump}
          onPrev={() => setArtistPage((p) => Math.max(1, p - 1))}
          onNext={() => setArtistPage((p) => Math.min(totalArtistPages, p + 1))}
          search={artistSearch}
          onSearchChange={setArtistSearch}
          searchPlaceholder="Search artists..."
        />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead className="text-right">Plays</TableHead>
                <TableHead className="text-right min-w-[100px] hidden sm:table-cell">
                  Minutes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArtists.length > 0 ? (
                paginatedArtists.map((artist) => {
                  const actualIndex = sortedArtists.findIndex((a) => a.name === artist.name);
                  const open = () => setTimelineItem({ name: artist.name, type: 'artist' });
                  return (
                    <TableRow
                      key={actualIndex}
                      tabIndex={0}
                      aria-label={`${artist.name}: open listening timeline`}
                      className={rowClass}
                      onClick={open}
                      onKeyDown={openOnKey(open)}
                    >
                      <TableCell className="py-2.5 tabular-nums text-muted-foreground">
                        {actualIndex + 1}
                      </TableCell>
                      <TableCell className="py-2.5 font-medium group-hover:text-primary transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{artist.name}</span>
                          <TrendingUp
                            className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex-shrink-0"
                            aria-hidden
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-right tabular-nums whitespace-nowrap">
                        {formatNumber(artist.playCount)}
                        <span className="block sm:hidden text-xs text-muted-foreground">
                          {formatNumber(msToMinutes(artist.totalMs))} min
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 text-right tabular-nums whitespace-nowrap text-muted-foreground hidden sm:table-cell">
                        {formatNumber(msToMinutes(artist.totalMs))} min
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    No artists found matching "{artistSearch}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <section aria-label="Top tracks" className="border border-border bg-card">
        <PanelHeader
          title="Top tracks"
          compareLabel="Compare tracks"
          onCompare={() => setShowTrackComparison(true)}
          page={trackPage}
          totalPages={totalTrackPages}
          pageInput={trackPageInput}
          onPageInputChange={setTrackPageInput}
          onPageJump={handleTrackPageJump}
          onPrev={() => setTrackPage((p) => Math.max(1, p - 1))}
          onNext={() => setTrackPage((p) => Math.min(totalTrackPages, p + 1))}
          search={trackSearch}
          onSearchChange={setTrackSearch}
          searchPlaceholder="Search tracks or artists..."
        />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-12">#</TableHead>
                <TableHead className="md:min-w-[150px]">Track</TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell">Artist</TableHead>
                <TableHead className="text-right">Plays</TableHead>
                <TableHead className="text-right min-w-[100px] hidden sm:table-cell">
                  Minutes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTracks.length > 0 ? (
                paginatedTracks.map((track) => {
                  const actualIndex = sortedTracks.findIndex(
                    (t) => t.name === track.name && t.artist === track.artist
                  );
                  const open = () =>
                    setTimelineItem({ name: track.name, type: 'track', artistName: track.artist });
                  return (
                    <TableRow
                      key={actualIndex}
                      tabIndex={0}
                      aria-label={`${track.name} by ${track.artist}: open listening timeline`}
                      className={rowClass}
                      onClick={open}
                      onKeyDown={openOnKey(open)}
                    >
                      <TableCell className="py-2.5 tabular-nums text-muted-foreground">
                        {actualIndex + 1}
                      </TableCell>
                      <TableCell className="py-2.5 font-medium max-w-[220px] group-hover:text-primary transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="min-w-0">
                            <span className="block truncate">{track.name}</span>
                            <span className="block md:hidden truncate text-xs font-normal text-muted-foreground">
                              {track.artist}
                            </span>
                          </span>
                          <TrendingUp
                            className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity flex-shrink-0"
                            aria-hidden
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 text-muted-foreground max-w-[160px] truncate hidden md:table-cell">
                        {track.artist}
                      </TableCell>
                      <TableCell className="py-2.5 text-right tabular-nums whitespace-nowrap">
                        {formatNumber(track.playCount)}
                        <span className="block sm:hidden text-xs text-muted-foreground">
                          {formatNumber(msToMinutes(track.totalMs))} min
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 text-right tabular-nums whitespace-nowrap text-muted-foreground hidden sm:table-cell">
                        {formatNumber(msToMinutes(track.totalMs))} min
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No tracks found matching "{trackSearch}"
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Timeline Modal */}
      {timelineItem && (
        <ItemTimeline
          itemName={timelineItem.name}
          itemType={timelineItem.type}
          artistName={timelineItem.artistName}
          onClose={() => setTimelineItem(null)}
        />
      )}

      {/* Artist Comparison Modal */}
      {showComparison && (
        <ArtistComparison
          onClose={() => setShowComparison(false)}
          initialArtists={sortedArtists.slice(0, 3).map((a) => a.name)}
        />
      )}

      {/* Track Comparison Modal */}
      {showTrackComparison && (
        <TrackComparison
          onClose={() => setShowTrackComparison(false)}
          initialTracks={sortedTracks.slice(0, 3).map((t) => ({ name: t.name, artist: t.artist }))}
        />
      )}
    </div>
  );
}
