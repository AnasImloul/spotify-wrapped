import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
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
    time: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    streak: 'from-orange-500/20 to-red-600/20 border-orange-500/30',
    variety: 'from-purple-500/20 to-pink-600/20 border-purple-500/30',
    artist: 'from-green-500/20 to-emerald-600/20 border-green-500/30',
    track: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30',
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-400" />
          Personal Records
        </CardTitle>
        <CardDescription className="text-white/60">
          Your listening milestones and highlights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {records.map((record) => {
            const IconComponent = categoryIcons[record.category];
            const colorClass = categoryColors[record.category];

            return (
              <div
                key={record.id}
                className={cn(
                  'rounded-lg p-4 border-2 transition-all duration-300 hover:scale-105 cursor-pointer',
                  `bg-gradient-to-br ${colorClass}`
                )}
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className="w-8 h-8 text-white/80" />
                  <IconComponent className="w-5 h-5 text-white/40" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-sm text-white/80 mb-1">
                  {record.title}
                </h3>

                {/* Value */}
                <p className="text-2xl font-bold text-white mb-1 truncate">
                  {record.value}
                </p>

                {/* Description */}
                <p className="text-xs text-white/60 truncate">
                  {record.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

