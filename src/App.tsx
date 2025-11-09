import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MainContent } from './components/MainContent';
import { StoryMode } from './components/StoryMode';
import { SharedAnalyticsView } from './components/SharedAnalyticsView';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { SpotifyDataProvider, DateRangeProvider, FilterProvider, BrandingProvider, ThemeProvider } from './contexts';
import { getCompactDataFromUrl } from './lib/binaryEncoding';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check for shared data on mount and redirect to /share if present
  useEffect(() => {
    const sharedData = getCompactDataFromUrl();
    if (sharedData && location.pathname !== '/share') {
      navigate('/share', { replace: true });
    }
  }, []);

  // Prevent body scrolling when Story Mode is active
  useEffect(() => {
    if (location.pathname === '/story') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [location.pathname]);

  return (
    <Routes>
      {/* Main analytics page */}
      <Route 
        path="/" 
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
            <MainContent onShowStoryMode={() => navigate('/story')} />
          </div>
        } 
      />
      
      {/* Story Mode */}
      <Route 
        path="/story" 
        element={<StoryMode onClose={() => navigate('/')} />} 
      />
      
      {/* Shared analytics view */}
      <Route 
        path="/share" 
        element={<SharedAnalyticsView onClose={() => navigate('/')} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <>
      <PWAInstallPrompt />
      <BrowserRouter>
        <ThemeProvider>
          <DateRangeProvider>
            <FilterProvider>
              <SpotifyDataProvider>
                <BrandingProvider>
                  <AppRoutes />
                </BrandingProvider>
              </SpotifyDataProvider>
            </FilterProvider>
          </DateRangeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

