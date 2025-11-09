import { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MainContent } from './components/MainContent';
import { StoryMode } from './components/StoryMode';
import { SharedAnalyticsView } from './components/SharedAnalyticsView';

/**
 * Redirect component for backward compatibility with old query param format
 * Redirects /share?share=xyz to /share/xyz
 */
function LegacyShareRedirect() {
  const [searchParams] = useSearchParams();
  const shareId = searchParams.get('share');

  if (shareId) {
    return <Navigate to={`/share/${shareId}`} replace />;
  }

  return <Navigate to="/" replace />;
}

/**
 * Story Mode route with body scroll prevention
 */
function StoryModeRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <StoryMode onClose={() => navigate('/')} />;
}

/**
 * Shared analytics route with body scroll prevention
 */
function SharedViewRoute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <SharedAnalyticsView onClose={() => navigate('/')} shareId={id} />;
}

/**
 * Main application routes
 */
export default function AppRoutes() {
  const navigate = useNavigate();

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
        element={<StoryModeRoute />}
      />

      {/* Shared analytics view with path parameter */}
      <Route
        path="/share/:id"
        element={<SharedViewRoute />}
      />

      {/* Backward compatibility: redirect old query param format */}
      <Route
        path="/share"
        element={<LegacyShareRedirect />}
      />
    </Routes>
  );
}

