import { FileUpload } from './components/FileUpload';
import { DateRangeSelector } from './components/DateRangeSelector';
import { StatsOverview } from './components/StatsOverview';
import { TopItems } from './components/TopItems';
import { ListeningTrends } from './components/ListeningTrends';
import { Music2, BarChart3, Trophy, TrendingUp } from 'lucide-react';
import { SpotifyDataProvider, DateRangeProvider, FilterProvider } from './contexts';
import { useSpotifyData, useDateRange, useFilterSettings } from './hooks';

function AppContent() {
  const { stats } = useSpotifyData();
  const { minDate, maxDate } = useDateRange();
  const { sortBy, setSortBy } = useFilterSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Spotify Wrapped
              </h1>
              <p className="text-sm text-green-400">
                Your Year in Music, Visualized
              </p>
            </div>
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
            <DateRangeSelector />
            
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
            
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-green-400" />
                Your Statistics
              </h3>
              <StatsOverview />
            </div>

            {(stats.topArtists.length > 0 || stats.topTracks.length > 0) && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-green-400" />
                    Hall of Fame
                  </h3>
                  <TopItems />
                </div>
              </>
            )}

            {stats.listeningByMonth && stats.listeningByMonth.length > 0 && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    Your Listening Journey
                  </h3>
                  <ListeningTrends />
                </div>
              </>
            )}
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
    </div>
  );
}

function App() {
  return (
    <DateRangeProvider>
      <FilterProvider>
        <SpotifyDataProvider>
          <AppContent />
        </SpotifyDataProvider>
      </FilterProvider>
    </DateRangeProvider>
  );
}

export default App;

