import {
  ListeningHeatmap,
  MonthlyTrends,
  ListeningPatterns,
  DiscoveryTimeline,
  YearInReviewCard,
} from '@/features/analytics';
import { Activity, Sparkles, Trophy } from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Activity className="w-8 h-8 text-green-400" />
          Listening Patterns
        </h3>
        <div className="space-y-8">
          <MonthlyTrends />
          <ListeningHeatmap />
          <ListeningPatterns />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          Discovery Journey
        </h3>
        <DiscoveryTimeline />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Your Year in Review
        </h3>
        <YearInReviewCard />
      </div>
    </div>
  );
}
