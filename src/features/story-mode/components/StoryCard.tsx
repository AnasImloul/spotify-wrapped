import { ReactNode } from 'react';
import { cn } from '@/shared/utils';
import { useBranding } from '@/features/sharing/contexts';

interface StoryCardProps {
  children: ReactNode;
  className?: string;
  gradient?: string;
  exportId?: string;
}

/**
 * Base wrapper for story cards - provides consistent styling
 */
export function StoryCard({ children, className, gradient, exportId }: StoryCardProps) {
  const defaultGradient = 'from-green-500/20 via-blue-500/20 to-purple-500/20';
  const { settings } = useBranding();
  
  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };
  
  return (
    <div
      id={exportId}
      className={cn(
        'relative w-full h-full flex flex-col items-center justify-center p-8',
        'bg-gradient-to-br',
        gradient || defaultGradient,
        'backdrop-blur-xl',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(29,185,84,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
      
      {/* Watermark */}
      {settings.showWatermark && (
        <div
          className={cn(
            'absolute z-10 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full border border-white/10',
            positionClasses[settings.watermarkPosition]
          )}
        >
          <p className="text-white/60 text-[10px] font-medium whitespace-nowrap">
            {settings.watermarkText}
          </p>
        </div>
      )}
    </div>
  );
}

