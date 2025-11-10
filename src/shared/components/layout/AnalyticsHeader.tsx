/**
 * Analytics Header Component
 * Main header with branding and actions
 */

import { Music2, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';
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
          <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                <Music2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  Spotify Wrapped
                </h1>
                <p className="text-xs sm:text-sm text-green-400 hidden xs:block">
                  Your Year in Music, Visualized
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            {hasData && (
              <nav className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Upload
                </NavLink>
                <NavLink
                  to="/analytics/overview"
                  className={({ isActive }) =>
                    `px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Overview
                </NavLink>
                <NavLink
                  to="/analytics/insights"
                  className={({ isActive }) =>
                    `px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  Insights
                </NavLink>
                <NavLink
                  to="/analytics/deep-dive"
                  className={({ isActive }) =>
                    `px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className="hidden sm:inline">Deep Dive</span>
                  <span className="sm:hidden">Deep</span>
                </NavLink>
              </nav>
            )}
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

