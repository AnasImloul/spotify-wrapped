import { StoryCard } from '../components/StoryCard';
import { formatNumber } from '@/shared/utils';
import { useAnimatedNumber } from '@/shared/hooks';

interface TotalTimeCardProps {
  minutes: number;
  funFact: string;
}

export function TotalTimeCard({ minutes, funFact }: TotalTimeCardProps) {
  const animatedMinutes = useAnimatedNumber({
    target: minutes,
    duration: 2000,
    easing: 'easeOutCubic',
  });

  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const display = formatNumber(animatedMinutes);

  return (
    <StoryCard
      field="yellow"
      exportId="story-total-time"
      label="Total Listening Time"
      readouts={[
        { value: formatNumber(hours), label: 'hours' },
        { value: days, label: 'days' },
      ]}
      foot={funFact}
    >
      <p
        className="font-extrabold leading-[0.85] tracking-[-0.055em] tabular-nums whitespace-nowrap"
        style={{ fontSize: `${display.length > 6 ? 27 : 34}cqw` }}
      >
        {display}
      </p>
      <p className="mt-3 text-[8cqw] font-medium leading-none">minutes</p>
    </StoryCard>
  );
}
