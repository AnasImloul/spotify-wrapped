import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { MainContent } from './components/MainContent';
import { StoryMode } from './components/StoryMode';
import { SharedAnalyticsView } from './components/SharedAnalyticsView';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { SpotifyDataProvider, DateRangeProvider, FilterProvider, BrandingProvider, ThemeProvider } from './contexts';
import { getCompactDataFromUrl } from './lib/binaryEncoding';

function SharedViewWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Redirect if no ID in URL
  useEffect(() => {
    if (!id) {
      navigate('/', { replace: true });
    }
  }, [id, navigate]);

  // Create a temporary URL with the ID as query param for the existing decoder
  useEffect(() => {
    if (id) {
      // Temporarily set the search params for the existing decoder
      const url = new URL(window.location.href);
      url.searchParams.set('share', id);
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, [id]);

  return <SharedAnalyticsView onClose={() => navigate('/')} />;
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check for old-style query param and redirect to new route
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shareId = params.get('share');
    if (shareId && !location.pathname.startsWith('/share/')) {
      navigate(`/share/${shareId}`, { replace: true });
    }
  }, [location, navigate]);

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
      
      {/* Shared analytics view with ID parameter */}
      <Route 
        path="/share/:id" 
        element={<SharedViewWrapper />} 
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

