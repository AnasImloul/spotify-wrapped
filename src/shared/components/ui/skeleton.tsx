import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('bg-white/[0.06] animate-pulse motion-reduce:animate-none', className)}
    />
  );
}

export function LoadingSection({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

export function ChartSkeleton({ label, height = 'h-72' }: { label: string; height?: string }) {
  return (
    <LoadingSection label={label} className="space-y-4">
      <Skeleton className="h-3 w-48" />
      <Skeleton className={cn('w-full', height)} />
    </LoadingSection>
  );
}

export function ReadoutsSkeleton({
  label,
  count = 4,
  columns = 'grid-cols-2 lg:grid-cols-4',
}: {
  label: string;
  count?: number;
  columns?: string;
}) {
  return (
    <LoadingSection label={label}>
      <div className={cn('grid gap-x-6 border-t border-border', columns)}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="py-4 border-b border-border space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        ))}
      </div>
    </LoadingSection>
  );
}

export function RowsSkeleton({ label, count = 6 }: { label: string; count?: number }) {
  return (
    <LoadingSection label={label}>
      <div className="border-t border-border">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-border">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-3 flex-1 max-w-[16rem]" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </LoadingSection>
  );
}

export function ModalSkeleton({ label, width = 'max-w-4xl' }: { label: string; width?: string }) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 sm:p-4 bg-black/75">
      <div
        role="status"
        className={cn(
          'w-full h-full sm:h-[85vh] flex flex-col border border-border bg-popover',
          width
        )}
      >
        <span className="sr-only">{label}</span>
        <div className="border-b border-foreground p-4 sm:p-6 space-y-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
