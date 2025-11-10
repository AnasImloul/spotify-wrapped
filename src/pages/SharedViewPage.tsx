import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { SharedAnalyticsView } from '@/features/sharing';

export default function SharedViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <Navigate to="/" replace />;
  }

  return <SharedAnalyticsView onClose={() => navigate('/')} shareId={id} />;
}

