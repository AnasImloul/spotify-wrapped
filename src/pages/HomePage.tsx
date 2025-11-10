import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsHero,
  AnalyticsInstructionsSection,
  AnalyticsFooter
} from '@/shared/components/layout';
import {
  FileUpload,
  DateRangeSelector
} from '@/features/data-import';
import {
  StatsOverview,
  TopItems,
  ListeningHeatmap,
  MonthlyTrends,
  ListeningPatterns,
  QuickStatsCarousel,
  PersonalRecords,
  ListeningStreak,
  DiscoveryTimeline,
  YearInReviewCard,
  MoodEnergyAnalysis,
  YearOverYearComparison
} from '@/features/analytics';
import { ShareExportMenu } from '@/features/sharing';
import { WelcomeModal, OnboardingTour, mainTourSteps } from '@/features/onboarding';
import { Music2, BarChart3, Trophy, Sparkles, Activity, Flame } from 'lucide-react';
import { useSpotifyData, useDateRange } from '@/shared/hooks';
import { useFilterSettings } from '@/features/analytics/hooks';
import { StorageService } from '@/shared/services';

export default function HomePage() {
  const navigate = useNavigate();
  const { stats, isProcessing } = useSpotifyData();
  const { minDate, maxDate } = useDateRange();
  const { sortBy, setSortBy } = useFilterSettings();
  const [tourActive, setTourActive] = useState(false);

  const handleStartTour = () => {
    setTourActive(true);
  };

  const handleCompleteTour = () => {
    setTourActive(false);
    StorageService.setTourCompleted();
  };

  const handleSkipTour = () => {
    setTourActive(false);
    StorageService.setTourCompleted();
  };

  return (
    <AnalyticsLayout>
      {/* Welcome Modal */}
      <WelcomeModal
        onClose={() => {}}
        onTrySample={() => {}}
        onStartTour={handleStartTour}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={mainTourSteps}
        isActive={tourActive}
        onComplete={handleCompleteTour}
        onSkip={handleSkipTour}
      />

      {/* Header */}
      <AnalyticsHeader
        hasData={!!stats}
        onShowStoryMode={() => navigate('/story')}
        renderShareMenu={() => stats ? (
          <ShareExportMenu
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
          />
        ) : null}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        <AnalyticsHero />
        
        <FileUpload />

        {isProcessing && (
          <div className="glass-card rounded-xl p-8 border border-green-500/30">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                <Music2 className="w-8 h-8 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-white">Processing your music data...</p>
                <p className="text-sm text-white/60">This may take a moment depending on your listening history</p>
              </div>
            </div>
          </div>
        )}

        {stats && minDate && maxDate && (
          <>
            <div data-tour="date-range">
              <DateRangeSelector />
            </div>

            <div className="animate-fade-in">
              <QuickStatsCarousel />
            </div>
            
            <div>
              <div className="glass-card rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium text-white/80">Sort Rankings By:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('time')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        sortBy === 'time'
                          ? 'bg-green-500/30 text-green-300 border border-green-500/40'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Listening Time
                    </button>
                    <button
                      onClick={() => setSortBy('plays')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        sortBy === 'plays'
                          ? 'bg-green-500/30 text-green-300 border border-green-500/40'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      Number of Plays
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {stats && (
          <div className="space-y-12 animate-fade-in">
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            
            <div data-tour="stats-overview">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-green-400" />
                Your Statistics
              </h3>
              <StatsOverview />
            </div>

            {(stats.topArtists.length > 0 || stats.topTracks.length > 0) && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <div data-tour="top-items">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-green-400" />
                    Hall of Fame
                  </h3>
                  <TopItems />
                </div>
              </>
            )}

            <>
              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            
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
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  Your Year in Review
                </h3>
                <YearInReviewCard />
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
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  Discovery Journey
                </h3>
                <DiscoveryTimeline />
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

              <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

              <div>
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-green-400" />
                  Advanced Analytics
                </h3>
                <div className="space-y-8">
                  <MonthlyTrends />
                  <ListeningHeatmap />
                  <ListeningPatterns />
                </div>
              </div>
            </>
          </div>
        )}

        {!stats && <AnalyticsInstructionsSection />}
      </main>

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}

