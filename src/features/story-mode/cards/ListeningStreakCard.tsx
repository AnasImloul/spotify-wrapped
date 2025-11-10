import { StoryCard } from '../components/StoryCard';
import { Flame, Calendar } from 'lucide-react';
import { useAnimatedNumber } from '@/shared/hooks';

interface ListeningStreakCardProps {
  streak: number;
}

export function ListeningStreakCard({ streak }: ListeningStreakCardProps) {
  const animatedStreak = useAnimatedNumber({
    target: streak,
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard gradient="from-orange-900/40 via-red-800/30 to-orange-700/20" exportId="story-streak">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-orange-400 to-red-600 p-5 sm:p-6 md:p-7 rounded-full">
            <Flame className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-orange-300 text-lg sm:text-xl md:text-2xl font-medium tracking-wide uppercase">
            Longest Listening Streak
          </p>
          <div className="w-20 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto" />
        </div>

        {/* Main stat */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-300 via-red-400 to-orange-500 bg-clip-text text-transparent">
            {animatedStreak}
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-white/80 font-light">consecutive days</p>
        </div>

        {/* Description */}
        <div className="space-y-3 sm:space-y-4 max-w-md px-2">
          <p className="text-white/70 text-base sm:text-lg md:text-xl">
            You kept the music going for{' '}
            <span className="text-orange-300 font-bold">{streak} days straight</span>!
          </p>
        </div>

        {/* Badge */}
        <div className="px-5 sm:px-6 md:px-7 py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-orange-300 text-base sm:text-lg md:text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            Dedication Level: Fire!
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

