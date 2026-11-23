import { formatNumber, msToMinutes } from '@/shared/utils';
import { useFilteredStats } from '@/shared/hooks';

const swatches = ['bg-code-green', 'bg-code-blue', 'bg-code-yellow'];

function Stat({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <div className="flex flex-col py-3 border-b border-border min-w-0">
      <dt className="label-caps mt-1 order-2">{label}</dt>
      <dd className="order-1 text-2xl lg:text-[1.75rem] font-medium leading-tight tabular-nums truncate">
        {value}
      </dd>
      {detail && <dd className="order-3 text-xs text-muted-foreground mt-0.5">{detail}</dd>}
    </div>
  );
}

export function StatsOverview() {
  const stats = useFilteredStats();

  if (!stats) {
    return null;
  }
  const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
  const totalHours = Math.round(totalMinutes / 60);
  const totalDays = Math.round(totalHours / 24);
  const topThree = stats.topArtists.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-caps">Total listening time</p>
        <p className="text-6xl xl:text-7xl font-medium leading-none tracking-[-0.03em] tabular-nums mt-2">
          {formatNumber(totalHours)}
          <span className="text-2xl xl:text-3xl text-muted-foreground tracking-normal ml-2">
            hours
          </span>
        </p>
        <p className="text-sm text-muted-foreground mt-2 tabular-nums">
          {formatNumber(totalMinutes)} minutes, or {formatNumber(totalDays)} days of pure music
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 border-t border-border">
        <Stat
          value={formatNumber(stats.totalTracks)}
          label="Tracks played"
          detail="Different songs"
        />
        <Stat
          value={formatNumber(stats.totalArtists)}
          label="Artists discovered"
          detail="Unique artists"
        />
        {stats.averageListeningPerDay > 0 && (
          <Stat
            value={`${Math.round(stats.averageListeningPerDay)} min`}
            label="Daily average"
            detail="Every single day"
          />
        )}
        {stats.mostActiveDay && (
          <Stat
            value={new Date(stats.mostActiveDay).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
            label="Most active day"
            detail={
              stats.mostActiveDayMinutes
                ? `${formatNumber(stats.mostActiveDayMinutes)} minutes played`
                : 'Your most music-filled day'
            }
          />
        )}
        {stats.yearlyMetrics && (
          <Stat
            value={`Top ${Math.round(100 - stats.yearlyMetrics.percentGreaterThanWorldwideUsers)}%`}
            label="Top listener"
            detail={`More than ${stats.yearlyMetrics.percentGreaterThanWorldwideUsers.toFixed(1)}% of Spotify users`}
          />
        )}
      </dl>

      {topThree.length > 0 && (
        <div>
          <p className="label-caps pb-2 border-b border-foreground">Top artists</p>
          <ol>
            {topThree.map((artist, i) => (
              <li
                key={artist.name}
                className="grid grid-cols-[1.5rem_0.625rem_1fr_auto] items-center gap-3 py-2 border-b border-border text-sm"
              >
                <span className="text-muted-foreground tabular-nums">{i + 1}</span>
                <span className={`h-2.5 w-2.5 ${swatches[i]}`} aria-hidden />
                <span className="font-medium truncate">{artist.name}</span>
                <span className="text-muted-foreground tabular-nums whitespace-nowrap">
                  {formatNumber(artist.playCount)} plays
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
