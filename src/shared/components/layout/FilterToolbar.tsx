/**
 * Filter Section Component
 * Filtering controls integrated into page content
 */

import { Link } from 'react-router-dom';
import { DateRangeSelector } from '@/features/data-import';
import { useSpotifyData } from '@/shared/hooks';

const SAMPLE_FILE_NAME = 'Sample_Streaming_History.json';

export function FilterToolbar() {
  const { uploadedFiles } = useSpotifyData();
  const isSample = uploadedFiles.some((file) => file.name === SAMPLE_FILE_NAME);

  return (
    <div className="relative z-20">
      {isSample && (
        <div className="border-b border-border">
          <p className="container mx-auto px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="label-caps text-code-yellow">Sample data</span>
            <span className="text-muted-foreground">
              You&apos;re looking at synthetic listening history.
            </span>
            <Link
              to="/"
              className="text-primary font-medium underline underline-offset-4 hover:text-foreground"
            >
              Upload your own files
            </Link>
          </p>
        </div>
      )}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <DateRangeSelector />
        </div>
      </div>
    </div>
  );
}
