/**
 * App Routes
 * Main application routes configuration
 */

import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import StoryModePage from '@/pages/StoryModePage';
import SharedViewPage from '@/pages/SharedViewPage';
import LegacyShareRedirectPage from '@/pages/LegacyShareRedirectPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Main analytics page */}
      <Route path="/" element={<HomePage />} />

      {/* Story Mode */}
      <Route path="/story" element={<StoryModePage />} />

      {/* Shared analytics view with path parameter */}
      <Route path="/share/:id" element={<SharedViewPage />} />

      {/* Backward compatibility: redirect old query param format */}
      <Route path="/share" element={<LegacyShareRedirectPage />} />
    </Routes>
  );
}

