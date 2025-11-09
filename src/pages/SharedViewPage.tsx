import { useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { SharedAnalyticsView } from '../components/SharedAnalyticsView';

export default function SharedViewPage() {
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

