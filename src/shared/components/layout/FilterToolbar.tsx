/**
 * Filter Section Component
 * Filtering controls integrated into page content
 */

import { DateRangeSelector } from '@/features/data-import';

export function FilterToolbar() {
  return (
    <div className="container mx-auto px-4 pt-6 pb-6">
      <DateRangeSelector />
    </div>
  );
}
