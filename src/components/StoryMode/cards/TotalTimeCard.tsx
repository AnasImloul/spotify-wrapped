import { StoryCard } from '../StoryCard';
import { Clock, Headphones } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useAnimatedNumber } from '@/hooks';

interface TotalTimeCardProps {
  minutes: number;
  funFact: string;
}

export function TotalTimeCard({ minutes, funFact }: TotalTimeCardProps) {
  const animatedMinutes = useAnimatedNumber({
    target: minutes,
    duration: 2000,
    easing: 'easeOutCubic',
  });
  
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  return (
    <StoryCard gradient="from-blue-900/40 via-cyan-800/30 to-blue-700/20" exportId="story-total-time">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-blue-400 to-cyan-600 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-full">
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-blue-300 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide uppercase">
            Total Listening Time
          </p>
          <div className="w-16 sm:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto" />
        </div>

        {/* Main stat */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            {formatNumber(animatedMinutes)}
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light">minutes</p>
        </div>

        {/* Secondary stats */}
        <div className="flex gap-3 sm:gap-4 lg:gap-6 xl:gap-8 items-center justify-center flex-wrap text-white/60 text-sm sm:text-base lg:text-lg xl:text-xl">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg lg:text-xl xl:text-2xl">=</span>
            <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white">{formatNumber(hours)}</span>
            <span>hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg lg:text-xl xl:text-2xl">=</span>
            <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-white">{days}</span>
            <span>days</span>
          </div>
        </div>

        {/* Fun fact */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 xl:py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md lg:max-w-lg xl:max-w-xl">
          <p className="text-blue-200 text-sm sm:text-base lg:text-lg xl:text-xl font-medium flex items-center justify-center gap-2">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
            <span>{funFact}</span>
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

