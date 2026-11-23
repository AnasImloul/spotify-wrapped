import {
  ListeningHeatmap,
  MonthlyTrends,
  ListeningPatterns,
  DiscoveryTimeline,
  YearInReviewCard,
} from '@/features/analytics';

const sectionHeading = 'text-2xl lg:text-3xl font-semibold tracking-[-0.01em]';

export default function InsightsPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <h3 className={`${sectionHeading} border-b border-border pb-4`}>Listening Patterns</h3>
        <div className="space-y-8">
          <MonthlyTrends />
          <ListeningHeatmap />
          <ListeningPatterns />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className={`${sectionHeading} border-b border-border pb-4`}>Discovery Journey</h3>
        <DiscoveryTimeline />
      </section>

      <section className="space-y-6">
        <h3 className={`${sectionHeading} border-b border-border pb-4`}>Your Year in Review</h3>
        <YearInReviewCard />
      </section>
    </div>
  );
}
