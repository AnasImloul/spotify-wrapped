import { useMemo } from 'react';
import { useSpotifyData } from '@/shared/hooks';
import { calculatePersonalRecords } from '@/lib/achievements';

export function PersonalRecords() {
  const { stats, streamingHistory } = useSpotifyData();

  const records = useMemo(() => {
    if (!stats || !streamingHistory) return [];
    return calculatePersonalRecords(stats, streamingHistory);
  }, [stats, streamingHistory]);

  if (!stats || records.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 border-t border-border">
      {records.map((record) => (
        <li key={record.id} className="flex flex-col py-4 border-b border-border min-w-0">
          <h4 className="order-2 label-caps truncate mt-1.5">{record.title}</h4>
          <p className="order-1 text-3xl font-medium leading-tight tracking-[-0.01em] tabular-nums truncate">
            {record.value}
          </p>
          <p className="order-3 text-sm text-muted-foreground mt-1 leading-relaxed">
            {record.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
