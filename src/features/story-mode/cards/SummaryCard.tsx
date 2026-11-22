import { StoryCard } from '../components/StoryCard';
import { formatNumber } from '@/shared/utils';

interface SummaryCardProps {
  totalTracks: number;
  uniqueArtists: number;
  uniqueTracks: number;
  dateRange: { start: string; end: string };
}

export function SummaryCard({
  totalTracks,
  uniqueArtists,
  uniqueTracks,
  dateRange,
}: SummaryCardProps) {
  return (
    <StoryCard
      field="green"
      exportId="story-summary"
      label={`${dateRange.start} - ${dateRange.end}`}
      readouts={[
        { value: formatNumber(totalTracks), label: 'Songs' },
        { value: formatNumber(uniqueArtists), label: 'Artists' },
        { value: formatNumber(uniqueTracks), label: 'Tracks' },
      ]}
      foot={
        <span className="block">
          Thanks for listening!
          <span className="block mt-1 font-medium normal-case tracking-normal text-[13px] text-[#121212]/75">
            Share your Wrapped story with friends
          </span>
        </span>
      }
    >
      <h1 className="text-[19cqw] font-extrabold leading-[0.88] tracking-[-0.045em] text-balance">
        Your Musical Year
      </h1>
    </StoryCard>
  );
}
