import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainContent } from '../components/MainContent';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
      <MainContent onShowStoryMode={() => navigate('/story')} />
    </div>
  );
}

