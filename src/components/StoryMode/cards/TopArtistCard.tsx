import { StoryCard } from '../StoryCard';
import { Music2, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useAnimatedNumbers } from '@/hooks';

interface TopArtistCardProps {
  name: string;
  minutes: number;
  playCount: number;
}

export function TopArtistCard({ name, minutes, playCount }: TopArtistCardProps) {
  const [animatedMinutes, animatedPlays] = useAnimatedNumbers({
    targets: [minutes, playCount],
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard gradient="from-green-900/40 via-green-800/30 to-green-700/20" exportId="story-top-artist">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-green-400 to-green-600 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-full">
            <Music2 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-green-300 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide uppercase">
            Your Top Artist
          </p>
          <div className="w-16 sm:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto" />
        </div>

        {/* Artist Name */}
        <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-2xl px-2">
          {name}
        </h1>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-6 lg:gap-8 xl:gap-10 items-center justify-center flex-wrap">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
              {formatNumber(animatedMinutes)}
            </p>
            <p className="text-white/60 text-xs sm:text-sm lg:text-base xl:text-lg uppercase tracking-wider mt-1">Minutes</p>
          </div>
          <div className="w-px h-8 sm:h-10 lg:h-14 xl:h-16 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {formatNumber(animatedPlays)}
            </p>
            <p className="text-white/60 text-xs sm:text-sm lg:text-base xl:text-lg uppercase tracking-wider mt-1">Plays</p>
          </div>
        </div>

        {/* Badge */}
        <div className="px-4 sm:px-5 lg:px-6 xl:px-8 py-2 sm:py-2.5 lg:py-3 xl:py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <p className="text-green-300 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
            <span className="hidden xs:inline">Your </span>#1 Fan Status
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

