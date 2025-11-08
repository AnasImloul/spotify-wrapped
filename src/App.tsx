import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { DateRangeSelector } from './components/DateRangeSelector';
import { StatsOverview } from './components/StatsOverview';
import { TopItems } from './components/TopItems';
import { ListeningTrends } from './components/ListeningTrends';
import { MusicEvolution } from './components/MusicEvolution';
import { parseUploadedFiles, getDateRangeFromFiles } from './lib/dataProcessor';
import { UploadedFile, ProcessedStats } from './types/spotify';
import { Music2, BarChart3, Trophy, TrendingUp, Sparkles } from 'lucide-react';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [stats, setStats] = useState<ProcessedStats | null>(null);
  
  // Date range state
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12`);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const handleFilesProcessed = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    
    if (files.length === 0) {
      setStats(null);
      setMinDate('');
      setMaxDate('');
      return;
    }

    // Get date range from files
    const { min, max } = getDateRangeFromFiles(files);
    setMinDate(min);
    setMaxDate(max);
    
    // If current date range is outside the data range, adjust it
    if (min && max) {
      const currentStart = startDate;
      const currentEnd = endDate;
      
      if (currentStart < min || currentStart > max) {
        setStartDate(min);
      }
      if (currentEnd > max || currentEnd < min) {
        setEndDate(max);
      }
    }
  };

  // Recalculate stats when date range changes
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const processedStats = parseUploadedFiles(uploadedFiles, startDate, endDate);
      setStats(processedStats);
    }
  }, [uploadedFiles, startDate, endDate]);

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
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Musical Story
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Upload your Spotify data export and dive deep into your listening habits.
            See your top artists, tracks, and how your music taste evolved throughout the year.
          </p>
        </div>

        {/* File Upload */}
        <FileUpload onFilesProcessed={handleFilesProcessed} />

        {/* Date Range Selector */}
        {stats && minDate && maxDate && (
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            minDate={minDate}
            maxDate={maxDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
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
              <StatsOverview stats={stats} />
            </div>

            {(stats.topArtists.length > 0 || stats.topTracks.length > 0) && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-green-400" />
                    Hall of Fame
                  </h3>
                  <TopItems stats={stats} />
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
                  <ListeningTrends stats={stats} />
                </div>
              </>
            )}

            {stats.musicEvolution && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-green-400" />
                    Your Musical Evolution
                  </h3>
                  <MusicEvolution stats={stats} />
                </div>
              </>
            )}
          </div>
        )}

        {/* How to Get Data Section */}
        {!stats && (
          <div className="mt-16 max-w-3xl mx-auto">
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
                    Scroll down and request your "Extended streaming history"
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span>
                    Wait for the email (usually takes a few days)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span>
                    Download the ZIP file and extract the JSON files
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <span>
                    Upload the files here to see your personalized wrapped!
                  </span>
                </li>
              </ol>
            <p className="mt-6 text-sm text-white/60 italic">
              Your data never leaves your device - all processing happens locally in your browser!
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
              Made with 💚 for music lovers |{' '}
              <span className="text-white/40">
                This is an unofficial tool and is not affiliated with Spotify
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

