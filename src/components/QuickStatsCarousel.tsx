import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Music, Headphones, Clock, Trophy, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilteredStats } from '@/hooks';
import { formatNumber, msToMinutes } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function QuickStatsCarousel() {
  const stats = useFilteredStats();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  if (!stats) return null;

  const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
  const totalHours = Math.round(totalMinutes / 60);
  const totalDays = Math.round(totalHours / 24);

  const quickStats = [
    {
      icon: Clock,
      label: 'Total Time',
      value: `${formatNumber(totalMinutes)} min`,
      subtitle: `That's ${totalDays} days!`,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Music,
      label: 'Songs Played',
      value: formatNumber(stats.totalTracks),
      subtitle: 'Unique tracks',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Headphones,
      label: 'Artists Explored',
      value: formatNumber(stats.totalArtists),
      subtitle: 'Different artists',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Trophy,
      label: 'Top Artist',
      value: stats.topArtists[0]?.name || 'N/A',
      subtitle: `${formatNumber(stats.topArtists[0]?.playCount || 0)} plays`,
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      icon: TrendingUp,
      label: 'Daily Average',
      value: `${Math.round(stats.averageListeningPerDay || 0)} min`,
      subtitle: 'Every single day',
      gradient: 'from-red-500 to-rose-600',
    },
  ];

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quickStats.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoplay, quickStats.length]);

  const goToPrev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + quickStats.length) % quickStats.length);
  };

  const goToNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % quickStats.length);
  };

  const currentStat = quickStats[currentIndex];
  const IconComponent = currentStat.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-lg p-6 sm:p-8">
      {/* Background gradient effect */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-10 transition-all duration-500',
        currentStat.gradient
      )} />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg',
              currentStat.gradient
            )}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm sm:text-base text-white/60 font-medium">
              {currentStat.label}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white truncate animate-fade-in">
            {currentStat.value}
          </h3>
          <p className="text-sm sm:text-base text-white/70">
            {currentStat.subtitle}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-1.5 mt-6">
          {quickStats.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoplay(false);
                setCurrentIndex(index);
              }}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

