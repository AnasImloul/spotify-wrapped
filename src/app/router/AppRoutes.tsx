/**
 * App Routes
 * Main application routes configuration
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from '@/pages/UploadPage';
import OverviewPage from '@/pages/analytics/OverviewPage';
import InsightsPage from '@/pages/analytics/InsightsPage';
import DeepDivePage from '@/pages/analytics/DeepDivePage';
import StoryModePage from '@/pages/StoryModePage';
import SharedViewPage from '@/pages/SharedViewPage';
import LegacyShareRedirectPage from '@/pages/LegacyShareRedirectPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Upload page */}
      <Route path="/" element={<UploadPage />} />

      {/* Analytics pages */}
      <Route path="/analytics/overview" element={<OverviewPage />} />
      <Route path="/analytics/insights" element={<InsightsPage />} />
      <Route path="/analytics/deep-dive" element={<DeepDivePage />} />
      <Route path="/analytics" element={<Navigate to="/analytics/overview" replace />} />

      {/* Story Mode */}
      <Route path="/story" element={<StoryModePage />} />

      {/* Shared analytics view with path parameter */}
      <Route path="/share/:id" element={<SharedViewPage />} />

      {/* Backward compatibility: redirect old query param format */}
      <Route path="/share" element={<LegacyShareRedirectPage />} />
    </Routes>
  );
}

