import { StoryCard } from '../StoryCard';
import { Sparkles, Calendar, Music, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface SummaryCardProps {
  totalTracks: number;
  uniqueArtists: number;
  uniqueTracks: number;
  dateRange: { start: string; end: string };
}

export function SummaryCard({ totalTracks, uniqueArtists, uniqueTracks, dateRange }: SummaryCardProps) {
  return (
    <StoryCard 
      gradient="from-slate-900/40 via-green-900/30 to-blue-900/20" 
      exportId="story-summary"
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-5 lg:space-y-8 max-w-2xl px-3 sm:px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-green-400 to-blue-600 p-4 sm:p-5 lg:p-8 xl:p-10 rounded-full">
            <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Your Musical Year
          </h1>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white/60">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
            <p className="text-xs sm:text-sm lg:text-lg xl:text-xl">
              {dateRange.start} - {dateRange.end}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-6 xl:gap-8 w-full">
          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 xl:space-y-4 p-3 sm:p-4 lg:p-6 xl:p-8 bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl xl:rounded-3xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-green-500/20 p-1.5 sm:p-2 lg:p-3 xl:p-4 rounded-full">
                <Music className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-green-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap">
              {formatNumber(totalTracks)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm xl:text-base uppercase tracking-wider">Songs Played</p>
          </div>

          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 xl:space-y-4 p-3 sm:p-4 lg:p-6 xl:p-8 bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl xl:rounded-3xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-blue-500/20 p-1.5 sm:p-2 lg:p-3 xl:p-4 rounded-full">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-blue-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap">
              {formatNumber(uniqueArtists)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm xl:text-base uppercase tracking-wider">Artists</p>
          </div>

          <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 xl:space-y-4 p-3 sm:p-4 lg:p-6 xl:p-8 bg-white/5 backdrop-blur-md rounded-xl lg:rounded-2xl xl:rounded-3xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-purple-500/20 p-1.5 sm:p-2 lg:p-3 xl:p-4 rounded-full">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 text-purple-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap">
              {formatNumber(uniqueTracks)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs lg:text-sm xl:text-base uppercase tracking-wider">Unique Tracks</p>
          </div>
        </div>

        {/* Footer message */}
        <div className="space-y-1 sm:space-y-2 lg:space-y-3">
          <p className="text-base sm:text-xl lg:text-2xl xl:text-3xl text-white/80 font-light">
            Thanks for listening!
          </p>
          <p className="text-white/50 text-[10px] sm:text-xs lg:text-sm xl:text-base">
            Share your Wrapped story with friends
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

