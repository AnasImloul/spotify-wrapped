import {
  ListeningHeatmap,
  MonthlyTrends,
  ListeningPatterns,
  DiscoveryTimeline,
  YearInReviewCard,
} from '@/features/analytics';
import {
  DeferredSection,
  ChartSkeleton,
  ReadoutsSkeleton,
  RowsSkeleton,
} from '@/shared/components/ui';

const sectionHeading = 'text-2xl lg:text-3xl font-semibold tracking-[-0.01em]';

export default function InsightsPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <h3 className={`${sectionHeading} border-b border-border pb-4`}>Listening Patterns</h3>
        <div className="space-y-8">
          <DeferredSection fallback={<ChartSkeleton label="Loading monthly trends" />}>
            <MonthlyTrends />
          </DeferredSection>
          <DeferredSection
            fallback={<ChartSkeleton label="Loading listening heatmap" height="h-64" />}
          >
            <ListeningHeatmap />
          </DeferredSection>
          <DeferredSection
            fallback={<ReadoutsSkeleton label="Loading listening patterns" count={8} />}
          >
            <ListeningPatterns />
          </DeferredSection>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className={`${sectionHeading} border-b border-border pb-4`}>Discovery Journey</h3>
        <DeferredSection fallback={<RowsSkeleton label="Loading discovery journey" count={8} />}>
          <DiscoveryTimeline />
        </DeferredSection>
      </section>

      <section className="space-y-6">
        <h3 className={`${sectionHeading} border-b border-border pb-4`}>Your Year in Review</h3>
        <DeferredSection fallback={<ChartSkeleton label="Loading year in review" height="h-80" />}>
          <YearInReviewCard />
        </DeferredSection>
      </section>
    </div>
  );
}
