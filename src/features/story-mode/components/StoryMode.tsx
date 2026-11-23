import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStoryData, useSwipeNavigation } from '@/shared/hooks';
import { TopArtistCard } from '../cards/TopArtistCard';
import { TopTrackCard } from '../cards/TopTrackCard';
import { TotalTimeCard } from '../cards/TotalTimeCard';
import { ListeningStreakCard } from '../cards/ListeningStreakCard';
import { DiscoveryCard } from '../cards/DiscoveryCard';
import { TimeOfDayCard } from '../cards/TimeOfDayCard';
import { SummaryCard } from '../cards/SummaryCard';
import { ShareMenu } from './ShareMenu';
import { STORY_FIELDS, type StoryField } from './storyFields';
import { cn } from '@/shared/utils';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface StoryModeProps {
  onClose: () => void;
}

interface StoryEntry {
  id: string;
  name: string;
  field: StoryField;
  node: ReactNode;
}

function compact<T>(items: (T | null | undefined | false)[]): T[] {
  return items.filter((item): item is T => Boolean(item));
}

export function StoryMode({ onClose }: StoryModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const storyData = useStoryData();

  const entries: StoryEntry[] = storyData
    ? compact<StoryEntry>([
        storyData.topArtist && {
          id: 'story-top-artist',
          name: 'Top Artist',
          field: 'green',
          node: (
            <TopArtistCard
              name={storyData.topArtist.name}
              minutes={storyData.topArtist.minutes}
              playCount={storyData.topArtist.playCount}
            />
          ),
        },
        storyData.topTrack && {
          id: 'story-top-track',
          name: 'Top Track',
          field: 'blue',
          node: (
            <TopTrackCard
              name={storyData.topTrack.name}
              artist={storyData.topTrack.artist}
              minutes={storyData.topTrack.minutes}
              playCount={storyData.topTrack.playCount}
            />
          ),
        },
        {
          id: 'story-total-time',
          name: 'Total Time',
          field: 'yellow',
          node: <TotalTimeCard minutes={storyData.totalMinutes} funFact={storyData.funFact} />,
        },
        {
          id: 'story-streak',
          name: 'Listening Streak',
          field: 'orange',
          node: <ListeningStreakCard streak={storyData.listeningStreak} />,
        },
        {
          id: 'story-discovery',
          name: 'Discovery',
          field: 'white',
          node: (
            <DiscoveryCard
              uniqueArtists={storyData.uniqueArtists}
              uniqueTracks={storyData.uniqueTracks}
            />
          ),
        },
        {
          id: 'story-time-of-day',
          name: 'Time of Day',
          field: 'black',
          node: (
            <TimeOfDayCard timeOfDay={storyData.timeOfDay} peakHour={storyData.peakListeningHour} />
          ),
        },
        {
          id: 'story-summary',
          name: 'Summary',
          field: 'green',
          node: (
            <SummaryCard
              totalTracks={storyData.totalTracks}
              uniqueArtists={storyData.uniqueArtists}
              uniqueTracks={storyData.uniqueTracks}
              dateRange={{ start: storyData.startDate, end: storyData.endDate }}
            />
          ),
        },
      ])
    : [];

  const totalCards = entries.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (totalCards ? (prev + 1) % totalCards : 0));
  }, [totalCards]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (totalCards ? (prev - 1 + totalCards) % totalCards : 0));
  }, [totalCards]);

  const swipeRef = useSwipeNavigation({
    onNext: goToNext,
    onPrev: goToPrev,
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (storyData === undefined) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A]">
        <div className="absolute inset-0 flex items-center justify-center sm:px-4">
          <div
            role="status"
            className="relative w-full sm:max-w-[440px] h-full sm:h-[90vh] bg-background px-5 pt-4 pb-8 flex flex-col"
          >
            <span className="sr-only">Loading your story</span>
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className="h-1 flex-1 bg-foreground/15" />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Skeleton className="h-3 w-14" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close story"
                className="h-10 w-10 inline-flex items-center justify-center border border-input text-foreground hover:border-foreground hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Skeleton className="mt-10 h-3 w-36" />
            <div className="flex-1 flex flex-col justify-center gap-4">
              <Skeleton className="h-16 w-4/5" />
              <Skeleton className="h-16 w-3/5" />
            </div>
            <div className="border-t-2 border-foreground/15 pt-4 grid grid-cols-2 gap-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!storyData || totalCards === 0) {
    return null;
  }

  const current = entries[Math.min(currentIndex, totalCards - 1)];
  const theme = STORY_FIELDS[current.field];
  const control = cn(
    'h-10 w-10 inline-flex items-center justify-center border transition-colors',
    current.field === 'black'
      ? 'border-input text-foreground hover:border-foreground hover:bg-white/5'
      : 'border-[#121212] text-[#121212] hover:bg-[#121212]/10'
  );

  const outerControl =
    'h-10 w-10 inline-flex items-center justify-center border border-input text-foreground hover:border-foreground hover:bg-white/5 transition-colors';

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]">
      <div ref={swipeRef} className="absolute inset-0 flex items-center justify-center sm:px-4">
        <div className="relative w-full sm:max-w-[440px] h-full sm:h-[90vh]">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Your listening story"
            className="relative w-full h-full overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          >
            <div
              key={current.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${currentIndex + 1} of ${totalCards}: ${current.name}`}
              className="w-full h-full animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none"
            >
              {current.node}
            </div>

            <div className="absolute top-4 left-5 right-5 z-20 flex gap-1" aria-hidden>
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={cn(
                    'h-1 flex-1 transition-colors duration-300',
                    index <= currentIndex ? theme.segment : theme.segmentDim
                  )}
                />
              ))}
            </div>

            <div className="absolute top-10 left-5 right-5 z-20 flex items-center justify-between">
              <span
                className={cn(
                  'text-[11px] font-bold uppercase tracking-[0.18em] tabular-nums',
                  theme.ink
                )}
              >
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                <ShareMenu
                  elementId={current.id}
                  cardName={current.name}
                  storyData={storyData}
                  variant="ghost"
                  size="icon"
                  className={cn(control, 'bg-transparent')}
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close story"
                  className={control}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous card"
                className={cn(outerControl, 'absolute -left-16 top-1/2 -translate-y-1/2 z-20')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentIndex < totalCards - 1 && (
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next card"
                className={cn(outerControl, 'absolute -right-16 top-1/2 -translate-y-1/2 z-20')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
