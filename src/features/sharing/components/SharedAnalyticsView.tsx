import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Download } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { getCompactDataFromUrl, expandCompactData } from '@/shared/services/sharing';
import { formatNumber } from '@/shared/utils';

interface SharedAnalyticsViewProps {
  onClose: () => void;
  shareId?: string;
}

export function SharedAnalyticsView({ onClose, shareId }: SharedAnalyticsViewProps) {
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<ReturnType<typeof expandCompactData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compactData = getCompactDataFromUrl(shareId);
    if (compactData) {
      const expanded = expandCompactData(compactData);
      setSharedData(expanded);
    }
    setLoading(false);
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-lg">Loading shared analytics...</div>
      </div>
    );
  }

  if (!sharedData) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleGetOwn = () => {
    // Navigate to home page
    navigate('/');
  };

  const ranked = (
    title: string,
    rows: { key: string; name: string; sub?: string; plays: number; minutes: number }[]
  ) => (
    <section aria-label={title}>
      <h3 className="text-lg font-semibold pb-2 border-b border-foreground">{title}</h3>
      <ol>
        {rows.map((row, index) => (
          <li
            key={row.key}
            className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-2.5 border-b border-border"
          >
            <span className="text-sm tabular-nums text-muted-foreground">{index + 1}</span>
            <span className="min-w-0">
              <span className="block font-medium truncate">{row.name}</span>
              {row.sub && (
                <span className="block text-xs text-muted-foreground truncate">{row.sub}</span>
              )}
            </span>
            <span className="text-right tabular-nums whitespace-nowrap">
              <span className="block text-sm">{formatNumber(row.minutes)} min</span>
              <span className="block text-xs text-muted-foreground">
                {formatNumber(row.plays)} plays
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="code-strip" aria-hidden>
              <i className="bg-code-green" />
              <i className="bg-code-blue" />
              <i className="bg-code-yellow" />
              <i className="bg-code-orange" />
            </span>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold uppercase tracking-[0.2em] truncate">
                Shared Spotify Analytics
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Someone shared their music stats with you!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button onClick={handleGetOwn} size="sm">
              <Download className="w-4 h-4" aria-hidden />
              <span className="hidden sm:inline">Get Your Own</span>
              <span className="sr-only sm:hidden">Get your own</span>
            </Button>
            <Button onClick={handleClose} variant="ghost" size="icon" aria-label="Close">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12 space-y-12">
        <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-5">
            <p className="label-caps">Total listening time</p>
            <p className="text-6xl xl:text-7xl font-medium leading-none tracking-[-0.03em] tabular-nums mt-2">
              {formatNumber(Math.round(sharedData.stats.totalListeningTime))}
              <span className="text-2xl xl:text-3xl text-muted-foreground tracking-normal ml-2">
                hours
              </span>
            </p>
            {sharedData.dateRange && (
              <p className="text-sm text-muted-foreground mt-2 tabular-nums">
                {new Date(sharedData.dateRange.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                -{' '}
                {new Date(sharedData.dateRange.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
          <dl className="lg:col-span-7 grid grid-cols-3 gap-x-6 border-t border-border">
            {[
              { label: 'Tracks played', value: formatNumber(sharedData.stats.totalTracks) },
              { label: 'Artists explored', value: formatNumber(sharedData.stats.uniqueArtists) },
              {
                label: 'Avg per day',
                value: `${formatNumber(Math.round(sharedData.stats.averageListeningPerDay))} min`,
              },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col py-3 min-w-0">
                <dt className="label-caps mt-1 order-2">{stat.label}</dt>
                <dd className="order-1 text-2xl lg:text-[1.75rem] font-medium leading-tight tabular-nums truncate">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {(Boolean(sharedData.topArtists?.length) || Boolean(sharedData.topTracks?.length)) && (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {sharedData.topArtists &&
              sharedData.topArtists.length > 0 &&
              ranked(
                'Top artists',
                sharedData.topArtists.map((artist, index) => ({
                  key: `${index}-${artist.name}`,
                  name: artist.name,
                  plays: artist.playCount,
                  minutes: artist.minutes,
                }))
              )}
            {sharedData.topTracks &&
              sharedData.topTracks.length > 0 &&
              ranked(
                'Top tracks',
                sharedData.topTracks.map((track, index) => ({
                  key: `${index}-${track.name}`,
                  name: track.name,
                  sub: track.artist,
                  plays: track.playCount,
                  minutes: track.minutes,
                }))
              )}
          </div>
        )}

        <section className="border-t border-foreground pt-8 grid md:grid-cols-[1fr_auto] gap-6 md:items-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Want to see your own Spotify analytics?</h3>
            <p className="text-muted-foreground max-w-prose">
              Upload your Spotify data and discover your unique listening patterns, top artists, and
              more!
            </p>
          </div>
          <Button onClick={handleGetOwn} size="lg" className="h-11 px-6 justify-self-start">
            <Download className="w-4 h-4" aria-hidden />
            Get Started
          </Button>
        </section>

        <div className="text-sm text-muted-foreground border-t border-border pt-4">
          <p>This analytics data was shared via URL encoding.</p>
          <p>
            No data was uploaded to any server - everything is processed locally in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
