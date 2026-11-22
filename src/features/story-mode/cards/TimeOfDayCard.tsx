import { StoryCard } from '../components/StoryCard';
import { fitHeadline } from '../components/storyFields';

interface TimeOfDayCardProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  peakHour: number;
}

const timeOfDayConfig = {
  morning: {
    label: 'Morning Vibes',
    description: 'You start your day with music',
  },
  afternoon: {
    label: 'Afternoon Energy',
    description: 'Midday tunes keep you going',
  },
  evening: {
    label: 'Evening Grooves',
    description: 'Sunset soundtrack enthusiast',
  },
  night: {
    label: 'Night Owl',
    description: 'Late night listening sessions',
  },
};

export function TimeOfDayCard({ timeOfDay, peakHour }: TimeOfDayCardProps) {
  const config = timeOfDayConfig[timeOfDay];

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <StoryCard
      field="black"
      exportId="story-time-of-day"
      label="Your Listening Time"
      foot={config.description}
    >
      <h1
        className="font-extrabold leading-[0.88] tracking-[-0.045em] break-words text-balance"
        style={fitHeadline(config.label)}
      >
        {config.label}
      </h1>
      <div className="mt-10 border-t-2 border-foreground pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Peak listening at
        </p>
        <p className="mt-2 text-[17cqw] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-primary">
          {formatHour(peakHour)}
        </p>
      </div>
    </StoryCard>
  );
}
