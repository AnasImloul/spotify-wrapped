import { StoryCard } from '../components/StoryCard';
import { Music, Disc3 } from 'lucide-react';
import { formatNumber } from '@/shared/utils';
import { useAnimatedNumbers } from '@/shared/hooks';

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
          <div className="relative bg-gradient-to-br from-purple-400 to-pink-600 p-5 sm:p-6 md:p-7 rounded-full">
            <Disc3 className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white animate-spin-slow" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-purple-300 text-lg sm:text-xl md:text-2xl font-medium tracking-wide uppercase">
            Your Top Track
          </p>
          <div className="w-20 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto" />
        </div>

        {/* Track Name */}
        <div className="space-y-2 sm:space-y-3 max-w-2xl px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/60">
            <Music className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
            <p className="text-lg sm:text-xl md:text-2xl truncate">{artist}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-6 md:gap-8 items-center justify-center flex-wrap">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              {formatNumber(animatedMinutes)}
            </p>
            <p className="text-white/60 text-sm sm:text-base md:text-lg uppercase tracking-wider mt-1">Minutes</p>
          </div>
          <div className="w-px h-10 sm:h-12 md:h-14 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
              {formatNumber(animatedPlays)}
            </p>
            <p className="text-white/60 text-sm sm:text-base md:text-lg uppercase tracking-wider mt-1">Plays</p>
          </div>
        </div>

        {/* Badge */}
        <div className="px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <p className="text-purple-300 text-base sm:text-lg md:text-xl font-semibold">
            On Repeat
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

