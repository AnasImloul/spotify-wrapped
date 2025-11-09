import { useState, useEffect } from 'react';
import { MainContent } from './components/MainContent';
import { StoryMode } from './components/StoryMode';
import { SpotifyDataProvider, DateRangeProvider, FilterProvider } from './contexts';

function AppContent() {
  const [showStoryMode, setShowStoryMode] = useState(false);

  // Prevent body scrolling when Story Mode is active
  useEffect(() => {
    if (showStoryMode) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [showStoryMode]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 ${showStoryMode ? 'overflow-hidden h-screen fixed inset-0' : ''}`}>
      {/* Only show main content when Story Mode is closed */}
      {!showStoryMode && <MainContent onShowStoryMode={() => setShowStoryMode(true)} />}

      {/* Story Mode Modal */}
      {showStoryMode && <StoryMode onClose={() => setShowStoryMode(false)} />}
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

