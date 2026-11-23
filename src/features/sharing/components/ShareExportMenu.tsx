import { Share2, Link, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useState } from 'react';
import { useFilteredStats, useDateRange } from '@/shared/hooks';
import { encodeAnalyticsToUrl, generateCompactShareUrl } from '@/shared/services/sharing';
import { useSortedArtists, useSortedTracks } from '@/shared/hooks';
import { copyTextToClipboard } from '@/lib/social';

interface ShareExportMenuProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShareExportMenu({
  variant = 'ghost',
  size = 'sm',
  className,
}: ShareExportMenuProps) {
  const stats = useFilteredStats();
  const { startDate, endDate } = useDateRange();
  const sortedArtists = useSortedArtists();
  const sortedTracks = useSortedTracks();

  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyShareLink = async () => {
    if (!stats) return;

    const encoded = encodeAnalyticsToUrl(
      stats,
      sortedArtists.slice(0, 10),
      sortedTracks.slice(0, 10),
      { startDate: new Date(startDate), endDate: new Date(endDate) }
    );
    const url = generateCompactShareUrl(encoded);

    try {
      await copyTextToClipboard(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  if (!stats) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyShareLink}>
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 mr-2 text-primary" />
              Link Copied!
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Copy Share Link
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Tip: Use Story Mode for shareable images
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
