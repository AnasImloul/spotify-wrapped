import { StoryCard } from '../components/StoryCard';
import { formatNumber } from '@/shared/utils';
import { useAnimatedNumbers } from '@/shared/hooks';

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
    <StoryCard
      field="white"
      exportId="story-discovery"
      label="Your Musical Universe"
      foot="Music Explorer"
    >
      <dl className="space-y-6">
        {[
          { label: 'Artists Explored', value: animatedArtists, size: 'text-[34cqw]' },
          { label: 'Tracks Discovered', value: animatedTracks, size: 'text-[24cqw]' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col border-t-2 border-[#121212] pt-3">
            <dt className="order-2 mt-2 text-[11px] font-bold uppercase tracking-[0.18em]">
              {stat.label}
            </dt>
            <dd
              className={`order-1 ${stat.size} font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums`}
            >
              {formatNumber(stat.value)}
            </dd>
          </div>
        ))}
      </dl>
    </StoryCard>
  );
}
