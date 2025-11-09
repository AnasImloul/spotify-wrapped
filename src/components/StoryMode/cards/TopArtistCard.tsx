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
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-green-400 to-green-600 p-4 sm:p-6 rounded-full">
            <Music2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-green-300 text-base sm:text-lg font-medium tracking-wide uppercase">
            Your Top Artist
          </p>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto" />
        </div>

        {/* Artist Name */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-2xl px-2">
          {name}
        </h1>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-6 items-center justify-center flex-wrap">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">
              {formatNumber(animatedMinutes)}
            </p>
            <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider mt-1">Minutes</p>
          </div>
          <div className="w-px h-8 sm:h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {formatNumber(animatedPlays)}
            </p>
            <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider mt-1">Plays</p>
          </div>
        </div>

        {/* Badge */}
        <div className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <p className="text-green-300 text-sm sm:text-base font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Your </span>#1 Fan Status
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

