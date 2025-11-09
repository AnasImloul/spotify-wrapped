import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  highlightPadding?: number;
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
  onSkip: () => void;
  isActive: boolean;
}

export function OnboardingTour({ steps, onComplete, onSkip, isActive }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || currentStep >= steps.length) return;

    const updateTargetPosition = () => {
      const step = steps[currentStep];
      const element = document.querySelector(step.target);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
        
        // Scroll element into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [currentStep, steps, isActive]);

  if (!isActive || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const placement = step.placement || 'bottom';
  const padding = step.highlightPadding || 8;

  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const tooltipOffset = 20;
    let top = 0;
    let left = 0;
    let transform = '';

    switch (placement) {
      case 'bottom':
        top = targetRect.bottom + tooltipOffset;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';
        break;
      case 'top':
        top = targetRect.top - tooltipOffset;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translate(-50%, -100%)';
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + tooltipOffset;
        transform = 'translateY(-50%)';
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - tooltipOffset;
        transform = 'translate(-100%, -50%)';
        break;
    }

    return { top: `${top}px`, left: `${left}px`, transform };
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Dark overlay with cut-out for highlighted element */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={onSkip}>
          <defs>
            <mask id="tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - padding}
                  y={targetRect.top - padding}
                  width={targetRect.width + padding * 2}
                  height={targetRect.height + padding * 2}
                  rx="8"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#tour-mask)" />
        </svg>

        {/* Highlight border */}
        {targetRect && (
          <div
            className="absolute border-2 border-green-400 rounded-lg pointer-events-none animate-pulse"
            style={{
              top: `${targetRect.top - padding}px`,
              left: `${targetRect.left - padding}px`,
              width: `${targetRect.width + padding * 2}px`,
              height: `${targetRect.height + padding * 2}px`,
              boxShadow: '0 0 0 4000px rgba(0,0,0,0.7)',
            }}
          />
        )}

        {/* Tooltip */}
        <div
          className="absolute pointer-events-auto"
          style={tooltipPosition}
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-green-500/30 rounded-lg shadow-2xl p-6 max-w-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-white pr-4">{step.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSkip}
                className="flex-shrink-0 h-6 w-6 text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <p className="text-white/80 mb-4 text-sm leading-relaxed">{step.content}</p>

            {/* Progress */}
            <div className="flex items-center gap-1 mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-green-400'
                      : index < currentStep
                      ? 'bg-green-400/50'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-white/60">
                {currentStep + 1} of {steps.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="text-white/80 hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Finish
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Tour steps for main application
export const mainTourSteps: TourStep[] = [
  {
    target: '[data-tour="file-upload"]',
    title: 'Upload Your Data',
    content: 'Drag and drop your Spotify streaming history files here. You can also try the sample data to explore the app first!',
    placement: 'bottom',
  },
  {
    target: '[data-tour="story-mode-button"]',
    title: 'Story Mode',
    content: 'View your listening stats as beautiful, swipeable story cards - perfect for sharing!',
    placement: 'bottom',
  },
  {
    target: '[data-tour="export-button"]',
    title: 'Export Your Stats',
    content: 'Export your analytics as a PDF or copy as text to share with friends.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="date-range"]',
    title: 'Filter by Date',
    content: 'Select a custom date range to see your stats for specific time periods.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="stats-overview"]',
    title: 'Your Statistics',
    content: 'See your total listening time, tracks played, artists discovered, and more!',
    placement: 'top',
  },
  {
    target: '[data-tour="top-items"]',
    title: 'Top Artists & Tracks',
    content: 'Browse your most-played content with search and pagination. Click any item to see its timeline!',
    placement: 'top',
  },
];

