import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import {
  AnalyticsLayout,
  AnalyticsHeader,
  AnalyticsHero,
  AnalyticsFooter
} from '@/shared/components/layout';
import {
  FileUpload
} from '@/features/data-import';
import { useSpotifyData } from '@/shared/hooks';

export default function UploadPage() {
  const navigate = useNavigate();
  const { stats, isProcessing } = useSpotifyData();
  const previousProcessingRef = useRef(isProcessing);
  const hadDataBeforeProcessing = useRef<boolean>(false);

  // Redirect to analytics when data has finished processing (only if uploading from empty state)
  useEffect(() => {
    // Track if processing just started (false -> true)
    if (!previousProcessingRef.current && isProcessing) {
      hadDataBeforeProcessing.current = !!stats;
    }
    
    // Only redirect if:
    // 1. Processing just finished (was true, now false)
    // 2. We have stats now
    // 3. There was no data before this processing started
    if (previousProcessingRef.current && !isProcessing && stats && !hadDataBeforeProcessing.current) {
      navigate('/analytics/overview');
    }
    
    previousProcessingRef.current = isProcessing;
  }, [stats, isProcessing, navigate]);

  return (
    <AnalyticsLayout>

      {/* Header */}
      <AnalyticsHeader
        hasData={!!stats}
        onShowStoryMode={() => navigate('/story')}
      />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12 space-y-12">
        <AnalyticsHero />
        
        <FileUpload />
      </main>

      <AnalyticsFooter />
    </AnalyticsLayout>
  );
}

