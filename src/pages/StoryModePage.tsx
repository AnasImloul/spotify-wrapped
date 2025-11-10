import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { StoryMode } from '@/features/story-mode';
import { useSpotifyData } from '@/shared/hooks';

export default function StoryModePage() {
  const navigate = useNavigate();
  const { stats } = useSpotifyData();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Redirect to home if no data is loaded
  if (!stats) {
    return <Navigate to="/" replace />;
  }

  return <StoryMode onClose={() => navigate('/')} />;
}

