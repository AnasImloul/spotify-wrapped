import { Share2, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
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
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleCopyShareLink}
      aria-label={copiedLink ? 'Share link copied' : 'Copy share link'}
    >
      {copiedLink ? (
        <Check className="w-4 h-4 text-primary" aria-hidden />
      ) : (
        <Share2 className="w-4 h-4" aria-hidden />
      )}
      <span className="hidden sm:inline" aria-live="polite">
        {copiedLink ? 'Link copied!' : 'Share'}
      </span>
    </Button>
  );
}
