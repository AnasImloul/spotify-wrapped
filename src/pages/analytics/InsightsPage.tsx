import { useNavigate } from 'react-router-dom';
import { AnalyticsLayout, AnalyticsHeader, AnalyticsFooter } from '@/shared/components/layout';
import {
  ListeningHeatmap,
  MonthlyTrends,
  ListeningPatterns,
  DiscoveryTimeline,
  YearInReviewCard,
} from '@/features/analytics';
import { ShareExportMenu } from '@/features/sharing';
import { Activity, Sparkles, Trophy } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';

export default function InsightsPage() {
  const navigate = useNavigate();
  const { stats } = useSpotifyData();

  return (
    <AnalyticsLayout>
      {/* Header */}
      <AnalyticsHeader
        hasData={!!stats}
        onShowStoryMode={() => navigate('/story')}
        renderShareMenu={() =>
          stats ? (
            <ShareExportMenu
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10"
            />
          ) : null
        }
      />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 space-y-12">
        {stats && (
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
        )}
      </main>

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}
