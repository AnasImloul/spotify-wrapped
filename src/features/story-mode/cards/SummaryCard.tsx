import { StoryCard } from '../components/StoryCard';
import { Sparkles, Calendar, Music, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/shared/utils';

interface SummaryCardProps {
  totalTracks: number;
  uniqueArtists: number;
  uniqueTracks: number;
  dateRange: { start: string; end: string };
}

export function SummaryCard({
  totalTracks,
  uniqueArtists,
  uniqueTracks,
  dateRange,
}: SummaryCardProps) {
  return (
    <StoryCard
      gradient="from-slate-900/40 via-green-900/30 to-blue-900/20"
      exportId="story-summary"
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-5 max-w-2xl px-3 sm:px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-green-400 to-blue-600 p-5 sm:p-6 md:p-7 rounded-full">
            <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Your Musical Year
          </h1>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white/60">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <p className="text-sm sm:text-base md:text-lg">
              {dateRange.start} - {dateRange.end}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full">
          <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 p-3 sm:p-5 md:p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-green-500/20 p-1.5 sm:p-2.5 md:p-3 rounded-full">
                <Music className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-400" />
              </div>
            </div>
            <p className="text-base sm:text-2xl md:text-3xl font-bold text-white">
              {formatNumber(totalTracks)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-sm md:text-base uppercase tracking-wider leading-tight">
              Songs
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 p-3 sm:p-5 md:p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-blue-500/20 p-1.5 sm:p-2.5 md:p-3 rounded-full">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400" />
              </div>
            </div>
            <p className="text-base sm:text-2xl md:text-3xl font-bold text-white">
              {formatNumber(uniqueArtists)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-sm md:text-base uppercase tracking-wider leading-tight">
              Artists
            </p>
          </div>

          <div className="space-y-1.5 sm:space-y-2 md:space-y-2.5 p-3 sm:p-5 md:p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-purple-500/20 p-1.5 sm:p-2.5 md:p-3 rounded-full">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-400" />
              </div>
            </div>
            <p className="text-base sm:text-2xl md:text-3xl font-bold text-white">
              {formatNumber(uniqueTracks)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-sm md:text-base uppercase tracking-wider leading-tight">
              Tracks
            </p>
          </div>
        </div>

        {/* Footer message */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light">
            Thanks for listening!
          </p>
          <p className="text-white/50 text-xs sm:text-sm md:text-base">
            Share your Wrapped story with friends
          </p>
        </div>
      </div>
    </StoryCard>
  );
}
