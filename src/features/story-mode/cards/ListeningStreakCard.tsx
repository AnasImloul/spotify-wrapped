import { StoryCard } from '../components/StoryCard';
import { useAnimatedNumber } from '@/shared/hooks';

interface ListeningStreakCardProps {
  streak: number;
}

export function ListeningStreakCard({ streak }: ListeningStreakCardProps) {
  const animatedStreak = useAnimatedNumber({
    target: streak,
    duration: 1500,
    easing: 'easeOutCubic',
  });

  return (
    <StoryCard
      field="orange"
      exportId="story-streak"
      label="Longest Listening Streak"
      foot="Dedication Level: Fire!"
    >
      <p
        className="font-extrabold leading-[0.85] tracking-[-0.055em] tabular-nums whitespace-nowrap"
        style={{ fontSize: `${String(animatedStreak).length > 3 ? 34 : 46}cqw` }}
      >
        {animatedStreak}
      </p>
      <p className="mt-3 text-[8cqw] font-medium leading-none">consecutive days</p>
      <p className="mt-8 pt-4 border-t-2 border-[#121212] text-[5cqw] leading-snug max-w-[34ch]">
        You kept the music going for <strong className="font-bold">{streak} days straight</strong>!
      </p>
    </StoryCard>
  );
}
