import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsHero,
  AnalyticsInstructionsSection,
  AnalyticsFooter
} from '@/shared/components/layout';
import {
  FileUpload
} from '@/features/data-import';
import { WelcomeModal, OnboardingTour, mainTourSteps } from '@/features/onboarding';
import { Music2 } from 'lucide-react';
import { useSpotifyData } from '@/shared/hooks';
import { StorageService } from '@/shared/services';

export default function UploadPage() {
  const navigate = useNavigate();
  const { stats, isProcessing } = useSpotifyData();
  const [tourActive, setTourActive] = useState(false);
  const previousProcessingRef = useRef(isProcessing);

  const handleStartTour = () => {
    setTourActive(true);
  };

  const handleCompleteTour = () => {
    setTourActive(false);
    StorageService.setTourCompleted();
  };

  const handleSkipTour = () => {
    setTourActive(false);
    StorageService.setTourCompleted();
  };

  // Redirect to analytics when data has finished processing
  useEffect(() => {
    // Only redirect if processing just finished (was true, now false) and we have stats
    if (previousProcessingRef.current && !isProcessing && stats) {
      navigate('/analytics/overview');
    }
    previousProcessingRef.current = isProcessing;
  }, [stats, isProcessing, navigate]);

  return (
    <AnalyticsLayout>
      {/* Welcome Modal */}
      <WelcomeModal
        onClose={() => {}}
        onTrySample={() => {}}
        onStartTour={handleStartTour}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        steps={mainTourSteps}
        isActive={tourActive}
        onComplete={handleCompleteTour}
        onSkip={handleSkipTour}
      />

      {/* Header */}
      <AnalyticsHeader
        hasData={!!stats}
        onShowStoryMode={() => navigate('/story')}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        <AnalyticsHero />
        
        <FileUpload />

        {isProcessing && (
          <div className="glass-card rounded-xl p-8 border border-green-500/30">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                <Music2 className="w-8 h-8 text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-white">Processing your music data...</p>
                <p className="text-sm text-white/60">This may take a moment depending on your listening history</p>
              </div>
            </div>
          </div>
        )}

        {!stats && <AnalyticsInstructionsSection />}
      </main>

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}

