import { ReactNode } from 'react';
import { cn } from '@/shared/utils';
import { useBranding } from '@/features/sharing/contexts';
import { STORY_FIELDS, STRIP, type StoryField } from './storyFields';

export interface StoryReadout {
  value: ReactNode;
  label: string;
}

interface StoryCardProps {
  field: StoryField;
  exportId?: string;
  label: string;
  children: ReactNode;
  readouts?: StoryReadout[];
  foot?: ReactNode;
  className?: string;
}

export function StoryCard({
  field,
  exportId,
  label,
  children,
  readouts,
  foot,
  className,
}: StoryCardProps) {
  const theme = STORY_FIELDS[field];
  const { settings } = useBranding();

  const positionClasses = {
    'bottom-left': 'bottom-4 left-5',
    'bottom-right': 'bottom-4 right-5',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      id={exportId}
      style={{ containerType: 'inline-size' }}
      className={cn(
        'relative w-full h-full flex flex-col px-5 pt-[104px]',
        settings.showWatermark ? 'pb-12' : 'pb-8',
        theme.bg,
        theme.ink,
        className
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em]">{label}</p>

      <div className="flex-1 min-h-0 flex flex-col justify-center py-4">{children}</div>

      {readouts && readouts.length > 0 && (
        <div className={cn('border-t-2 pt-4', theme.rule)}>
          <dl
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${readouts.length}, minmax(0, 1fr))` }}
          >
            {readouts.map((readout) => (
              <div key={readout.label} className="flex flex-col min-w-0">
                <dt className="order-2 mt-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
                  {readout.label}
                </dt>
                <dd
                  className={cn(
                    'order-1 leading-none font-semibold tracking-[-0.02em] tabular-nums truncate',
                    readouts.length > 2 ? 'text-[8cqw]' : 'text-[11cqw]'
                  )}
                >
                  {readout.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {foot && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex-1 text-[11px] font-bold uppercase tracking-[0.18em] min-w-0">
            {foot}
          </div>
          <span className="code-strip shrink-0" aria-hidden>
            {STRIP.map(([square, cls]) => (
              <i key={square} className={square === field ? 'bg-[#121212]' : cls} />
            ))}
          </span>
        </div>
      )}

      {settings.showWatermark && (
        <p
          className={cn(
            'absolute text-[10px] font-medium whitespace-nowrap',
            theme.muted,
            positionClasses[settings.watermarkPosition]
          )}
        >
          {settings.watermarkText}
        </p>
      )}
    </div>
  );
}
