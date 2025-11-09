import { StoryCard } from '../StoryCard';
import { Sparkles, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useAnimatedNumbers } from '@/hooks';

interface DiscoveryCardProps {
  uniqueArtists: number;
  uniqueTracks: number;
}

export function DiscoveryCard({ uniqueArtists, uniqueTracks }: DiscoveryCardProps) {
  const [animatedArtists, animatedTracks] = useAnimatedNumbers({
    targets: [uniqueArtists, uniqueTracks],
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard gradient="from-pink-900/40 via-rose-800/30 to-purple-700/20" exportId="story-discovery">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10 px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-pink-400 to-purple-600 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-full">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-pink-300 text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide uppercase">
            Your Musical Universe
          </p>
          <div className="w-16 sm:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto" />
        </div>

        {/* Stats Grid */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 xl:space-y-14">
          <div className="text-center">
            <p className="text-pink-200 text-sm sm:text-base lg:text-lg xl:text-xl mb-2 sm:mb-3 lg:mb-4 uppercase tracking-wider">Artists Explored</p>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">
              {formatNumber(animatedArtists)}
            </h2>
          </div>

          <div className="w-24 sm:w-28 lg:w-32 xl:w-36 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />

          <div className="text-center">
            <p className="text-purple-200 text-sm sm:text-base lg:text-lg xl:text-xl mb-2 sm:mb-3 lg:mb-4 uppercase tracking-wider">Tracks Discovered</p>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
              {formatNumber(animatedTracks)}
            </h2>
          </div>
        </div>

        {/* Badge */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 xl:py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-pink-300 text-sm sm:text-base lg:text-lg xl:text-xl font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            Music Explorer
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

