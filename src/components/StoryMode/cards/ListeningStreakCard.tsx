import { StoryCard } from '../StoryCard';
import { Flame, Calendar } from 'lucide-react';
import { useAnimatedNumber } from '@/hooks';

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
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-orange-400 to-red-600 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-full">
            <Flame className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-orange-300 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide uppercase">
            Longest Listening Streak
          </p>
          <div className="w-16 sm:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto" />
        </div>

        {/* Main stat */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-5">
          <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold bg-gradient-to-r from-orange-300 via-red-400 to-orange-500 bg-clip-text text-transparent">
            {animatedStreak}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light">consecutive days</p>
        </div>

        {/* Description */}
        <div className="space-y-3 sm:space-y-4 max-w-md lg:max-w-lg px-2">
          <p className="text-white/70 text-sm sm:text-base lg:text-lg xl:text-xl">
            You kept the music going for{' '}
            <span className="text-orange-300 font-bold">{streak} days straight</span>!
          </p>
        </div>

        {/* Badge */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 xl:py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-orange-300 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            Dedication Level: Fire!
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

