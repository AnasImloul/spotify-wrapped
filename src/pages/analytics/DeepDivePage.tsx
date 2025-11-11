import { useNavigate } from 'react-router-dom';
import { AnalyticsLayout, AnalyticsHeader, AnalyticsFooter } from '@/shared/components/layout';
import {
  PersonalRecords,
  ListeningStreak,
  MoodEnergyAnalysis,
  YearOverYearComparison,
} from '@/features/analytics';
import { ShareExportMenu } from '@/features/sharing';
import { Trophy, Flame, Sparkles, BarChart3 } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';

export default function DeepDivePage() {
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
                <Trophy className="w-8 h-8 text-yellow-400" />
                Personal Records
              </h3>
              <PersonalRecords />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-400" />
                Listening Consistency
              </h3>
              <ListeningStreak />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
                Mood & Energy
              </h3>
              <MoodEnergyAnalysis />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                Year-over-Year Analysis
              </h3>
              <YearOverYearComparison />
            </div>
          </div>
        )}
      </main>

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}
