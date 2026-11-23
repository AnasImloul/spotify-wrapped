import { StoryCard } from '../components/StoryCard';
import { fitHeadline } from '../components/storyFields';
import { formatNumber } from '@/shared/utils';
import { useAnimatedNumbers } from '@/shared/hooks';

interface TopArtistCardProps {
  name: string;
  minutes: number;
  playCount: number;
}

export function TopArtistCard({ name, minutes, playCount }: TopArtistCardProps) {
  const [animatedMinutes, animatedPlays] = useAnimatedNumbers({
    targets: [minutes, playCount],
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard
      field="green"
      exportId="story-top-artist"
      label="Your Top Artist"
      readouts={[
        { value: formatNumber(animatedMinutes), label: 'Minutes' },
        { value: formatNumber(animatedPlays), label: 'Plays' },
      ]}
      foot="Your #1 Fan Status"
    >
      <h1
        className="font-extrabold leading-[0.88] tracking-[-0.045em] break-words text-balance"
        style={fitHeadline(name)}
      >
        {name}
      </h1>
    </StoryCard>
  );
}
