import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, Upload, Play, ChevronRight, X } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onTrySample: () => void;
  onStartTour: () => void;
}

export function WelcomeModal({ onClose, onTrySample, onStartTour }: WelcomeModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setOpen(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleTrySample = () => {
    setOpen(false);
    onTrySample();
  };

  const handleStartTour = () => {
    setOpen(false);
    onStartTour();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 border-green-500/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-green-400" />
              Welcome to Spotify Wrapped
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DialogDescription className="text-lg text-white/70 mt-2">
            Explore your musical journey with powerful analytics and beautiful visualizations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">Story Mode</h3>
              <p className="text-sm text-white/60">Swipeable cards with your top stats</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">Analytics</h3>
              <p className="text-sm text-white/60">Deep insights into your listening habits</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="font-semibold text-white mb-1">Share</h3>
              <p className="text-sm text-white/60">Export and share your stats</p>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleTrySample}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-14 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Try with Sample Data
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={handleStartTour}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 h-12"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Take a Quick Tour
            </Button>

            <Button
              onClick={handleClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white hover:bg-white/5"
            >
              <Upload className="w-4 h-4 mr-2" />
              I'll Upload My Own Data
            </Button>
          </div>

          {/* Privacy notice */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong className="font-semibold">🔒 100% Private:</strong> All data processing happens in your browser. 
              Nothing is uploaded to any server. Your listening history stays completely private.
            </p>
          </div>

          {/* Instructions */}
          <details className="text-sm text-white/60">
            <summary className="cursor-pointer hover:text-white font-medium mb-2">
              How to get your Spotify data
            </summary>
            <ol className="space-y-2 pl-4 list-decimal">
              <li>Visit your <a href="https://www.spotify.com/account/privacy/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Spotify Privacy Settings</a></li>
              <li>Request "Extended streaming history" (recommended)</li>
              <li>Wait for email confirmation (5-30 days)</li>
              <li>Download and upload your JSON files here</li>
            </ol>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  );
}

