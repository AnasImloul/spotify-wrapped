import { useMemo } from 'react';
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

  const categorySwatch = {
    time: 'bg-code-green',
    streak: 'bg-code-orange',
    variety: 'bg-code-yellow',
    artist: 'bg-code-blue',
    track: 'bg-foreground',
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 border-t border-border">
      {records.map((record) => {
        const IconComponent = categoryIcons[record.category];

        return (
          <li key={record.id} className="py-4 border-b border-border min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn('h-2.5 w-2.5 flex-shrink-0', categorySwatch[record.category])}
                aria-hidden
              />
              <h4 className="label-caps truncate">{record.title}</h4>
              <IconComponent
                className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0"
                aria-hidden
              />
            </div>
            <p className="text-3xl font-medium leading-tight tracking-[-0.01em] tabular-nums truncate">
              {record.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {record.description}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
