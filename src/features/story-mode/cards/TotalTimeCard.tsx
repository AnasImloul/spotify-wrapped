import { StoryCard } from '../components/StoryCard';
import { Clock, Headphones } from 'lucide-react';
import { formatNumber } from '@/shared/utils';
import { useAnimatedNumber } from '@/shared/hooks';

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
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-blue-400 to-cyan-600 p-5 sm:p-6 md:p-7 rounded-full">
            <Clock className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-blue-300 text-lg sm:text-xl md:text-2xl font-medium tracking-wide uppercase">
            Total Listening Time
          </p>
          <div className="w-20 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto" />
        </div>

        {/* Main stat */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            {formatNumber(animatedMinutes)}
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-white/80 font-light">minutes</p>
        </div>

        {/* Secondary stats */}
        <div className="flex gap-3 sm:gap-4 md:gap-6 items-center justify-center flex-wrap text-white/60 text-base sm:text-lg md:text-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl">=</span>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{formatNumber(hours)}</span>
            <span>hours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl">=</span>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{days}</span>
            <span>days</span>
          </div>
        </div>

        {/* Fun fact */}
        <div className="px-5 sm:px-6 md:px-7 py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md">
          <p className="text-blue-200 text-base sm:text-lg md:text-xl font-medium flex items-center justify-center gap-2">
            <Headphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
            <span>{funFact}</span>
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

