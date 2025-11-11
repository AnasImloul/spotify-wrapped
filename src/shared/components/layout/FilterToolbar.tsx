/**
 * Filter Section Component
 * Filtering controls integrated into page content
 */

import { DateRangePopover } from '@/features/data-import';

export function FilterToolbar() {
  return (
    <div className="container mx-auto px-4 pt-6 pb-2">
      <div className="flex items-center justify-end gap-3">
        <DateRangePopover />
      </div>
    </div>
  );
}
