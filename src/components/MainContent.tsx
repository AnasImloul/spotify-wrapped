import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { DateRangeSelector } from './DateRangeSelector';
import { StatsOverview } from './StatsOverview';
import { TopItems } from './TopItems';
import { ListeningHeatmap } from './ListeningHeatmap';
import { MonthlyTrends } from './MonthlyTrends';
import { ListeningPatterns } from './ListeningPatterns';
import { ShareExportMenu } from './ShareExportMenu';
import { WelcomeModal } from './WelcomeModal';
import { OnboardingTour, mainTourSteps } from './OnboardingTour';
import { ThemeToggle } from './ThemeToggle';
import { Music2, BarChart3, Trophy, Sparkles, Activity } from 'lucide-react';
import { useSpotifyData, useDateRange, useFilterSettings } from '@/hooks';
import { Button } from './ui/button';
import { isFeatureEnabled } from '@/lib/featureFlags';

interface MainContentProps {
  onShowStoryMode: () => void;
}

export function MainContent({ onShowStoryMode }: MainContentProps) {
  const { stats } = useSpotifyData();
  const { minDate, maxDate } = useDateRange();
  const { sortBy, setSortBy } = useFilterSettings();
  const [tourActive, setTourActive] = useState(false);

  const handleStartTour = () => {
    setTourActive(true);
  };

  const handleCompleteTour = () => {
    setTourActive(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  const handleSkipTour = () => {
    setTourActive(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  return (
    <>
      {/* Welcome Modal */}
      <WelcomeModal
        onClose={() => {}}
        onTrySample={() => {
          // Sample data loading is handled by FileUpload component
        }}
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
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                  Spotify Wrapped
                </h1>
                <p className="text-xs sm:text-sm text-green-400 hidden xs:block truncate">
                  Your Year in Music, Visualized
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            {stats && (
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {isFeatureEnabled('THEME_TOGGLE') && <ThemeToggle />}
                <ShareExportMenu 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/80 hover:text-white hover:bg-white/10"
                />
                <Button
                  onClick={onShowStoryMode}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 px-2 sm:px-4 shadow-lg shadow-green-500/20"
                  data-tour="story-mode-button"
                >
                  <Sparkles className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Story</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Discover Your{' '}
            <span className="animated-gradient">
              Musical Story
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Upload your Spotify data export to explore your listening patterns,
            discover your most-played content, and visualize your musical journey.
          </p>
        </div>

        {/* File Upload */}
        <FileUpload />

        {/* Date Range Selector */}
        {stats && minDate && maxDate && (
          <>
            <div data-tour="date-range">
              <DateRangeSelector />
            </div>
            
            {/* Global Sorting Selector */}
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

        {/* Statistics Display */}
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

            {/* Advanced Analytics Section */}
            <>
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

        {/* How to Get Data Section */}
        {!stats && (
          <div className="mt-16">
            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                How to Get Your Spotify Data
              </h3>
              <ol className="space-y-3 text-white/80">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span>
                    Go to your{' '}
                    <a
                      href="https://www.spotify.com/account/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline"
                    >
                      Spotify Privacy Settings
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span>
                    Request "Extended streaming history" (recommended) or "Account data" (standard)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    Wait for Spotify's email (5-30 days for extended, 1-5 days for standard)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>
                    Download and extract the files: <code className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">StreamingHistory_music_*.json</code> (standard) or <code className="font-mono text-xs bg-white/10 px-1 py-0.5 rounded">Streaming_History_Audio_*.json</code> (extended)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>
                    Upload the streaming history files to analyze your data
                  </span>
                </li>
              </ol>
            <p className="mt-6 text-sm text-white/60 italic">
              Your data remains on your device—all processing happens locally
            </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/60 text-sm">
            <p>
              Built for music enthusiasts |{' '}
              <span className="text-white/40">
                Independent project not affiliated with Spotify
              </span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

