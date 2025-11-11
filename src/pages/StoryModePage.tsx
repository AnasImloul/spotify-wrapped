import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryMode } from '@/features/story-mode';

export default function StoryModePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return <StoryMode onClose={() => navigate('/')} />;
}
