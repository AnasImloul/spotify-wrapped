import { useState, useEffect } from 'react';
import { MainContent } from './components/MainContent';
import { StoryMode } from './components/StoryMode';
import { SpotifyDataProvider, DateRangeProvider, FilterProvider, BrandingProvider } from './contexts';

function AppContent() {
  const [showStoryMode, setShowStoryMode] = useState(false);

  // Prevent body scrolling when Story Mode is active
  useEffect(() => {
    if (showStoryMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showStoryMode]);

  // When Story Mode is active, only render Story Mode (no parent wrapper)
  if (showStoryMode) {
    return <StoryMode onClose={() => setShowStoryMode(false)} />;
  }

  // When Story Mode is closed, render main content with gradient background
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
      <MainContent onShowStoryMode={() => setShowStoryMode(true)} />
    </div>
  );
}

function App() {
  return (
    <DateRangeProvider>
      <FilterProvider>
        <SpotifyDataProvider>
          <BrandingProvider>
            <AppContent />
          </BrandingProvider>
        </SpotifyDataProvider>
      </FilterProvider>
    </DateRangeProvider>
  );
}

export default App;

