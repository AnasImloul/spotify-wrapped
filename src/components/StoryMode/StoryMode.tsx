import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStoryData, useSwipeNavigation } from '@/hooks';
import { TopArtistCard } from './cards/TopArtistCard';
import { TopTrackCard } from './cards/TopTrackCard';
import { TotalTimeCard } from './cards/TotalTimeCard';
import { ListeningStreakCard } from './cards/ListeningStreakCard';
import { DiscoveryCard } from './cards/DiscoveryCard';
import { TimeOfDayCard } from './cards/TimeOfDayCard';
import { SummaryCard } from './cards/SummaryCard';
import { ShareMenu } from './ShareMenu';
import { cn } from '@/lib/utils';

interface StoryModeProps {
  onClose: () => void;
}

export function StoryMode({ onClose }: StoryModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const storyData = useStoryData();

  const totalCards = 7; // Number of story cards

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const swipeRef = useSwipeNavigation({
    onNext: goToNext,
    onPrev: goToPrev,
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!storyData) {
    return null;
  }

  const cardIds = [
    'story-top-artist',
    'story-top-track',
    'story-total-time',
    'story-streak',
    'story-discovery',
    'story-time-of-day',
    'story-summary',
  ];

  const cardNames = [
    'Top Artist',
    'Top Track',
    'Total Time',
    'Listening Streak',
    'Discovery',
    'Time of Day',
    'Summary',
  ];

  const cards = [
    storyData.topArtist && (
      <TopArtistCard
        key="top-artist"
        name={storyData.topArtist.name}
        minutes={storyData.topArtist.minutes}
        playCount={storyData.topArtist.playCount}
      />
    ),
    storyData.topTrack && (
      <TopTrackCard
        key="top-track"
        name={storyData.topTrack.name}
        artist={storyData.topTrack.artist}
        minutes={storyData.topTrack.minutes}
        playCount={storyData.topTrack.playCount}
      />
    ),
    <TotalTimeCard
      key="total-time"
      minutes={storyData.totalMinutes}
      funFact={storyData.funFact}
    />,
    <ListeningStreakCard key="streak" streak={storyData.listeningStreak} />,
    <DiscoveryCard
      key="discovery"
      uniqueArtists={storyData.uniqueArtists}
      uniqueTracks={storyData.uniqueTracks}
    />,
    <TimeOfDayCard
      key="time-of-day"
      timeOfDay={storyData.timeOfDay}
      peakHour={storyData.peakListeningHour}
    />,
    <SummaryCard
      key="summary"
      totalTracks={storyData.totalTracks}
      uniqueArtists={storyData.uniqueArtists}
      uniqueTracks={storyData.uniqueTracks}
      dateRange={{ start: storyData.startDate, end: storyData.endDate }}
    />,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Story card container */}
      <div
        ref={swipeRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Card wrapper with responsive sizing - wider on desktop */}
        <div className="relative w-full max-w-[360px] md:max-w-[440px] lg:max-w-[500px] h-full sm:h-[90vh] md:h-[85vh] lg:h-[80vh] sm:rounded-3xl overflow-hidden shadow-2xl">
          {/* Current card */}
          <div className="w-full h-full">{cards[currentIndex]}</div>

          {/* Progress indicators */}
          <div className="absolute top-4 left-0 right-0 z-20 px-4">
            <div className="flex gap-1">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    index === currentIndex
                      ? 'bg-white'
                      : index < currentIndex
                      ? 'bg-white/70'
                      : 'bg-white/30'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Top controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <ShareMenu
              elementId={cardIds[currentIndex]}
              cardName={cardNames[currentIndex]}
              storyData={storyData}
              variant="ghost"
              size="icon"
              className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border border-white/20"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border border-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation buttons (desktop) */}
          <div className="hidden sm:block">
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            {currentIndex < cards.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Card counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <p className="text-white text-sm font-medium">
                {currentIndex + 1} / {cards.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

