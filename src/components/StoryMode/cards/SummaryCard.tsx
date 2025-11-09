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
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-5 max-w-2xl px-3 sm:px-4">
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full" />
          <div className="relative bg-gradient-to-br from-green-400 to-blue-600 p-4 sm:p-5 rounded-full">
            <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Your Musical Year
          </h1>
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-white/60">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <p className="text-xs sm:text-sm">
              {dateRange.start} - {dateRange.end}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full">
          <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-green-500/20 p-1.5 sm:p-2 rounded-full">
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white whitespace-nowrap">
              {formatNumber(totalTracks)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider">Songs Played</p>
          </div>

          <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-blue-500/20 p-1.5 sm:p-2 rounded-full">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white whitespace-nowrap">
              {formatNumber(uniqueArtists)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider">Artists</p>
          </div>

          <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <div className="flex justify-center">
              <div className="bg-purple-500/20 p-1.5 sm:p-2 rounded-full">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-white whitespace-nowrap">
              {formatNumber(uniqueTracks)}
            </p>
            <p className="text-white/60 text-[10px] sm:text-xs uppercase tracking-wider">Unique Tracks</p>
          </div>
        </div>

        {/* Footer message */}
        <div className="space-y-1 sm:space-y-2">
          <p className="text-base sm:text-xl text-white/80 font-light">
            Thanks for listening!
          </p>
          <p className="text-white/50 text-[10px] sm:text-xs">
            Share your Wrapped story with friends
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

