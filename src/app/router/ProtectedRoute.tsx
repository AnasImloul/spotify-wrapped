/**
 * Protected Route Component
 * Redirects to upload page if no data is available
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useSpotifyData } from '@/shared/hooks';

export default function ProtectedRoute() {
  const { stats, isProcessing, uploadedFiles } = useSpotifyData();

  // Show loading state while processing
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-white text-lg">Processing your data...</p>
        </div>
      </div>
    );
  }

  // If no stats and no uploaded files, redirect to upload page
  if (!stats && uploadedFiles.length === 0) {
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
}
