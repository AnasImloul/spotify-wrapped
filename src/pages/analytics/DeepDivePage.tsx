import {
  PersonalRecords,
  ListeningStreak,
  MoodEnergyAnalysis,
  YearOverYearComparison,
} from '@/features/analytics';

const sections = [
  { title: 'Personal Records', Component: PersonalRecords },
  { title: 'Listening Consistency', Component: ListeningStreak },
  { title: 'Mood & Energy', Component: MoodEnergyAnalysis },
  { title: 'Year-over-Year Analysis', Component: YearOverYearComparison },
];

export default function DeepDivePage() {
  return (
    <div className="space-y-16">
      {sections.map(({ title, Component }) => (
        <section key={title} className="space-y-6">
          <h3 className="text-2xl lg:text-3xl font-semibold tracking-[-0.01em] border-b border-border pb-4">
            {title}
          </h3>
          <Component />
        </section>
      ))}
    </div>
  );
}
