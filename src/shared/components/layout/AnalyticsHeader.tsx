/**
 * Analytics Header Component
 * Main header with branding and actions
 */

import { useState } from 'react';
import { Play, HelpCircle } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, ConfirmModal } from '@/shared/components/ui';
import { useSpotifyData } from '@/shared/hooks';
import { InstructionsModal } from '@/shared';

const navItems: { to: string; label: string }[] = [
  { to: '/', label: 'Upload' },
  { to: '/analytics/overview', label: 'Overview' },
  { to: '/analytics/insights', label: 'Insights' },
  { to: '/analytics/deep-dive', label: 'Deep Dive' },
];

interface AnalyticsHeaderProps {
  hasData: boolean;
  onShowStoryMode: () => void;
  renderShareMenu?: () => React.ReactNode;
}

export function AnalyticsHeader({
  hasData,
  onShowStoryMode,
  renderShareMenu,
}: AnalyticsHeaderProps) {
  const navigate = useNavigate();
  const { clearData } = useSpotifyData();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const handleLogoClick = () => {
    if (hasData) {
      // Show confirmation modal if data exists
      setShowConfirmModal(true);
    } else {
      // Just navigate if no data
      navigate('/');
    }
  };

  const handleConfirmClear = () => {
    clearData();
    navigate('/');
  };

  return (
    <>
      <ConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmClear}
        title="Clear All Data?"
        description="This will remove all uploaded files and analytics data. You'll need to upload your files again to view your stats."
        confirmText="Clear Data"
        cancelText="Cancel"
      />

      <InstructionsModal open={showInstructionsModal} onOpenChange={setShowInstructionsModal} />

      <header className="border-b border-border bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 flex flex-wrap md:flex-nowrap items-stretch justify-between gap-x-2 lg:gap-x-6">
          <div className="contents md:flex md:items-stretch md:gap-6 lg:gap-8 md:min-w-0 md:flex-1">
            <button
              onClick={handleLogoClick}
              className="h-14 lg:h-16 flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity"
              title={hasData ? 'Clear data and start over' : 'Go to home'}
            >
              <span className="block h-3 w-3 bg-primary shrink-0" aria-hidden />
              <span className="flex flex-col text-left leading-tight">
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Spotify Wrapped
                </span>
                <span className="hidden xl:block text-xs text-muted-foreground">
                  Your Year in Music, Visualized
                </span>
              </span>
            </button>

            {hasData && (
              <nav
                aria-label="Sections"
                className="order-last basis-[calc(100%+1.5rem)] md:order-none md:basis-auto h-11 md:h-auto flex items-stretch gap-1 lg:gap-2 overflow-x-auto scrollbar-hide border-t border-border md:border-t-0 -mx-3 px-1 md:mx-0"
              >
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative flex items-center px-2 lg:px-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? 'text-foreground after:absolute after:inset-x-2 lg:after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            )}
          </div>

          {hasData ? (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {renderShareMenu?.()}
              <Button onClick={onShowStoryMode} size="sm" className="px-2.5 sm:px-4">
                <Play className="w-4 h-4 fill-current" aria-hidden />
                <span className="hidden sm:inline">Story</span>
                <span className="sr-only sm:hidden">Story mode</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button onClick={() => setShowInstructionsModal(true)} size="sm" variant="outline">
                <HelpCircle className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">How to Get Your Data</span>
                <span className="sm:hidden">Help</span>
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
