import { StoryCard } from '../StoryCard';
import { Music, Disc3 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useAnimatedNumbers } from '@/hooks';

interface TopTrackCardProps {
  name: string;
  artist: string;
  minutes: number;
  playCount: number;
}

export function TopTrackCard({ name, artist, minutes, playCount }: TopTrackCardProps) {
  const [animatedMinutes, animatedPlays] = useAnimatedNumbers({
    targets: [minutes, playCount],
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard gradient="from-purple-900/40 via-purple-800/30 to-pink-700/20" exportId="story-top-track">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-purple-400 to-pink-600 p-4 sm:p-6 rounded-full">
            <Disc3 className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin-slow" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-purple-300 text-base sm:text-lg font-medium tracking-wide uppercase">
            Your Top Track
          </p>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto" />
        </div>

        {/* Track Name */}
        <div className="space-y-2 sm:space-y-3 max-w-2xl px-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Music className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <p className="text-base sm:text-lg truncate">{artist}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-6 items-center justify-center flex-wrap">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              {formatNumber(animatedMinutes)}
            </p>
            <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider mt-1">Minutes</p>
          </div>
          <div className="w-px h-8 sm:h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
              {formatNumber(animatedPlays)}
            </p>
            <p className="text-white/60 text-xs sm:text-sm uppercase tracking-wider mt-1">Plays</p>
          </div>
        </div>

        {/* Badge */}
        <div className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <p className="text-purple-300 text-sm sm:text-base font-semibold">
            On Repeat
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

