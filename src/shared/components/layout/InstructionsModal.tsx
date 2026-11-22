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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground">
            How to Get Your Spotify Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ol className="space-y-4 text-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold tabular-nums">
                1
              </span>
              <span className="pt-0.5">
                Go to your{' '}
                <a
                  href="https://www.spotify.com/account/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary underline"
                >
                  Spotify Privacy Settings
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold tabular-nums">
                2
              </span>
              <span className="pt-0.5">
                Request "Extended streaming history" (recommended) or "Account data" (standard)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold tabular-nums">
                3
              </span>
              <span className="pt-0.5">
                Wait for Spotify's email (5-30 days for extended, 1-5 days for standard)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold tabular-nums">
                4
              </span>
              <span className="pt-0.5">
                Download and extract the files:{' '}
                <code className="font-mono text-xs bg-white/[0.06] px-1.5 py-0.5">
                  StreamingHistory_music_*.json
                </code>{' '}
                (standard) or{' '}
                <code className="font-mono text-xs bg-white/[0.06] px-1.5 py-0.5">
                  Streaming_History_Audio_*.json
                </code>{' '}
                (extended)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold tabular-nums">
                5
              </span>
              <span className="pt-0.5">
                Upload the streaming history files to analyze your data
              </span>
            </li>
          </ol>

          <div className="border-t border-border pt-4">
            <p className="text-sm text-foreground">
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
