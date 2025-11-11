/**
 * Instructions Modal Component
 * Shows instructions for getting Spotify data in a modal dialog
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

interface InstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstructionsModal({ open, onOpenChange }: InstructionsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-black border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            How to Get Your Spotify Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ol className="space-y-4 text-white/80">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="pt-0.5">
                Go to your{' '}
                <a
                  href="https://www.spotify.com/account/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Spotify Privacy Settings
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="pt-0.5">
                Request "Extended streaming history" (recommended) or "Account data" (standard)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="pt-0.5">
                Wait for Spotify's email (5-30 days for extended, 1-5 days for standard)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span className="pt-0.5">
                Download and extract the files:{' '}
                <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
                  StreamingHistory_music_*.json
                </code>{' '}
                (standard) or{' '}
                <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded">
                  Streaming_History_Audio_*.json
                </code>{' '}
                (extended)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                5
              </span>
              <span className="pt-0.5">
                Upload the streaming history files to analyze your data
              </span>
            </li>
          </ol>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong className="font-semibold">100% Private:</strong> All data processing happens
              in your browser. Nothing is uploaded to any server. Your listening history stays
              completely private.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
