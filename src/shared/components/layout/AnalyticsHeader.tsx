/**
 * Analytics Header Component
 * Main header with branding and actions
 */

import { Music2, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface AnalyticsHeaderProps {
  hasData: boolean;
  onShowStoryMode: () => void;
  renderShareMenu?: () => React.ReactNode;
}

export function AnalyticsHeader({ hasData, onShowStoryMode, renderShareMenu }: AnalyticsHeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                Spotify Wrapped
              </h1>
              <p className="text-xs sm:text-sm text-green-400 hidden xs:block truncate">
                Your Year in Music, Visualized
              </p>
            </div>
          </div>
          
          {/* Header Actions */}
          {hasData && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {renderShareMenu?.()}
              <Button
                onClick={onShowStoryMode}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 px-2 sm:px-4 shadow-lg shadow-green-500/20"
                data-tour="story-mode-button"
              >
                <Sparkles className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Story</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

