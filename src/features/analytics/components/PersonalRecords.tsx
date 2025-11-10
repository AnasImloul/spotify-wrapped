import { useMemo } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Trophy, Clock, Flame, Star, Music } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';
import { calculatePersonalRecords } from '@/lib/achievements';
import { cn } from '@/shared/utils';

export function PersonalRecords() {
  const { stats, streamingHistory } = useSpotifyData();

  const records = useMemo(() => {
    if (!stats || !streamingHistory) return [];
    return calculatePersonalRecords(stats, streamingHistory);
  }, [stats, streamingHistory]);

  if (!stats || records.length === 0) return null;

  const categoryIcons = {
    time: Clock,
    streak: Flame,
    variety: Star,
    artist: Music,
    track: Trophy,
  };

  const categoryColors = {
    time: {
      bg: 'from-green-500/20 via-emerald-600/20 to-teal-500/15',
      border: 'border-green-500/40',
      icon: 'bg-gradient-to-br from-green-500 to-emerald-600',
      iconText: 'text-white',
      glow: 'shadow-green-500/50',
      hoverGlow: 'group-hover:shadow-green-400/60',
      accent: 'bg-green-500/10',
      particle: 'bg-green-400',
    },
    streak: {
      bg: 'from-amber-500/20 via-yellow-500/20 to-green-500/15',
      border: 'border-amber-500/40',
      icon: 'bg-gradient-to-br from-amber-500 to-yellow-600',
      iconText: 'text-white',
      glow: 'shadow-amber-500/50',
      hoverGlow: 'group-hover:shadow-amber-400/60',
      accent: 'bg-amber-500/10',
      particle: 'bg-amber-400',
    },
    variety: {
      bg: 'from-teal-500/20 via-cyan-500/20 to-emerald-500/15',
      border: 'border-teal-500/40',
      icon: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      iconText: 'text-white',
      glow: 'shadow-teal-500/50',
      hoverGlow: 'group-hover:shadow-teal-400/60',
      accent: 'bg-teal-500/10',
      particle: 'bg-teal-400',
    },
    artist: {
      bg: 'from-emerald-600/20 via-green-600/20 to-teal-600/15',
      border: 'border-emerald-600/40',
      icon: 'bg-gradient-to-br from-emerald-600 to-green-700',
      iconText: 'text-white',
      glow: 'shadow-emerald-600/50',
      hoverGlow: 'group-hover:shadow-emerald-500/60',
      accent: 'bg-emerald-600/10',
      particle: 'bg-emerald-400',
    },
    track: {
      bg: 'from-lime-500/20 via-green-500/20 to-emerald-500/15',
      border: 'border-lime-500/40',
      icon: 'bg-gradient-to-br from-lime-500 to-green-600',
      iconText: 'text-white',
      glow: 'shadow-lime-500/50',
      hoverGlow: 'group-hover:shadow-lime-400/60',
      accent: 'bg-lime-500/10',
      particle: 'bg-lime-400',
    },
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const IconComponent = categoryIcons[record.category];
            const colors = categoryColors[record.category];

            return (
              <div
                key={record.id}
                className={cn(
                  'group relative rounded-xl p-4 border-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer overflow-hidden',
                  `bg-gradient-to-br ${colors.bg} ${colors.border}`
                )}
              >
                {/* Animated particles on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className={cn('w-2 h-2 rounded-full animate-ping', colors.particle)} />
                </div>
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <div className={cn('w-1.5 h-1.5 rounded-full animate-ping', colors.particle)} />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with animated background */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      'relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105',
                      colors.icon
                    )}>
                      <IconComponent className={cn('w-6 h-6', colors.iconText)} />
                    </div>
                    
                    {/* Achievement badge */}
                    <div className={cn(
                      'px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300',
                      colors.accent
                    )}>
                      <Trophy className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Title with animated underline */}
                  <div className="mb-2">
                    <h3 className="font-bold text-xs text-white/80 uppercase tracking-wider mb-1 group-hover:text-white transition-colors">
                      {record.title}
                    </h3>
                    <div className="h-0.5 w-0 group-hover:w-12 bg-gradient-to-r from-white/50 to-transparent transition-all duration-500" />
                  </div>

                  {/* Value with enhanced styling */}
                  <p className="text-3xl font-black text-white mb-2 truncate group-hover:text-white drop-shadow-lg transition-all duration-300 tracking-tight">
                    {record.value}
                  </p>

                  {/* Description with icon */}
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                    <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
                      {record.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div className={cn(
                    'absolute -bottom-1 left-0 right-0 h-1 opacity-50 group-hover:opacity-100 transition-opacity',
                    colors.accent
                  )} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

