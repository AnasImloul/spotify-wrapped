import { StoryCard } from '../components/StoryCard';
import { fitHeadline } from '../components/storyFields';
import { formatNumber } from '@/shared/utils';
import { useAnimatedNumbers } from '@/shared/hooks';

interface TopTrackCardProps {
  name: string;
  artist: string;
  minutes: number;
  playCount: number;
}

export function TopTrackCard({ name, artist, minutes, playCount }: TopTrackCardProps) {
  const [animatedMinutes, animatedPlays] = useAnimatedNumbers({
    targets: [minutes, playCount],
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard
      field="blue"
      exportId="story-top-track"
      label="Your Top Track"
      readouts={[
        { value: formatNumber(animatedMinutes), label: 'Minutes' },
        { value: formatNumber(animatedPlays), label: 'Plays' },
      ]}
      foot="On Repeat"
    >
      <h1
        className="font-extrabold leading-[0.88] tracking-[-0.045em] break-words text-balance"
        style={fitHeadline(name)}
      >
        {name}
      </h1>
      <p className="mt-4 text-[6.5cqw] font-medium leading-tight truncate">{artist}</p>
    </StoryCard>
  );
}
