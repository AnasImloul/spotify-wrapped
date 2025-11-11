import { Share2, Link, FileText, Copy, Check } from 'lucide-react';
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
import { generatePDFReport, exportStatsAsText, copyToClipboard } from '@/shared/services/export';
import {
  encodeAnalyticsToUrl,
  generateCompactShareUrl,
  generateSummaryText,
  getCompactDataFromUrl,
} from '@/shared/services/sharing';
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

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!stats || isExporting) return;

    setIsExporting(true);
    try {
      await generatePDFReport(stats, { start: startDate, end: endDate });
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyAsText = async () => {
    if (!stats) return;

    const text = exportStatsAsText(stats, { start: startDate, end: endDate });
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  const handleCopyShareText = async () => {
    if (!stats) return;

    const encoded = encodeAnalyticsToUrl(
      stats,
      sortedArtists.slice(0, 10),
      sortedTracks.slice(0, 10),
      { startDate: new Date(startDate), endDate: new Date(endDate) }
    );
    const url = generateCompactShareUrl(encoded);

    const compactData = getCompactDataFromUrl() || {
      v: 2,
      s: [
        stats.totalListeningTime,
        stats.totalTracks,
        stats.totalArtists,
        stats.totalTracks,
        stats.totalArtists,
        stats.averageListeningPerDay,
        stats.mostActiveDay,
        stats.mostActiveDayMinutes,
      ],
      a: sortedArtists
        .slice(0, 10)
        .map((a) => [a.name, Math.round(a.totalTime / 60000), a.playCount]),
      t: sortedTracks
        .slice(0, 10)
        .map((t) => [t.name, t.artist, Math.round(t.totalMs / 60000), t.playCount]),
      dr: [startDate, endDate],
    };
    const shareText = generateSummaryText(compactData as any);

    try {
      await copyTextToClipboard(`${shareText}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (!stats) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyShareLink}>
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Link Copied!
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Copy Share Link
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyShareText}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Text + Link
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export as PDF'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyAsText}>
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy as Text
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
