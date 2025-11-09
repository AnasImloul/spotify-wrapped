import { useState } from 'react';
import { Link, Copy, Check, AlertCircle, ExternalLink, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSpotifyData, useSortedArtists, useSortedTracks } from '@/hooks';
import {
  encodeAnalyticsToUrl,
  generateCompactShareUrl,
  isUrlSizeSafe,
  generateSummaryText,
  getCompactDataFromUrl,
} from '@/lib/binaryEncoding';
import { copyTextToClipboard } from '@/lib/social';

interface ShareableLinkProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
}

export function ShareableLink({
  variant = 'outline',
  size = 'default',
  className,
  showIcon = true,
}: ShareableLinkProps) {
  const { stats } = useSpotifyData();
  const sortedArtists = useSortedArtists();
  const sortedTracks = useSortedTracks();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!stats) return null;

  // Generate compact binary-encoded URL
  const encoded = encodeAnalyticsToUrl(
    stats,
    sortedArtists.slice(0, 10),
    sortedTracks.slice(0, 10)
  );
  const url = generateCompactShareUrl(encoded);
  const isSafe = isUrlSizeSafe(encoded);

  // Generate shareable text
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
    a: sortedArtists.slice(0, 10).map((a) => [a.name, Math.round(a.totalTime / 60000), a.playCount]),
    t: sortedTracks.slice(0, 10).map((t) => [t.name, t.artist, Math.round(t.totalMs / 60000), t.playCount]),
  };
  const shareText = generateSummaryText(compactData as any);

  const handleCopyUrl = async () => {
    try {
      await copyTextToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleCopyText = async () => {
    try {
      await copyTextToClipboard(`${shareText}\n\n${url}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {showIcon && <Link className="w-4 h-4 mr-2" />}
          <span>Get Shareable Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Shareable Analytics Link
          </DialogTitle>
          <DialogDescription>
            Share your Spotify analytics with a single link. No data upload required - everything is encoded in the URL!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* URL Size Warning */}
          {!isSafe && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Warning: This URL is {url.length} characters long and may not work in all browsers. Consider sharing fewer items or using the image/PDF export instead.
              </AlertDescription>
            </Alert>
          )}

          {/* Binary Encoding Info */}
          <Alert className="bg-green-500/10 border-green-500/20">
            <Zap className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">
              Using MessagePack binary encoding (40-50% smaller than JSON)
            </AlertDescription>
          </Alert>

          {/* URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Shareable URL</label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-xs break-all">
                {url}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                className="flex-shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              URL Length: {url.length} characters {isSafe ? '✓ Safe' : '⚠️ May be too long'}
            </p>
          </div>

          {/* Preview Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview Text</label>
            <div className="p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
              {shareText}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopyUrl} variant="default" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button onClick={handleCopyText} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              {copiedText ? 'Copied!' : 'Copy Text + Link'}
            </Button>
            <Button onClick={handleOpenInNewTab} variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Test Link
            </Button>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-200">
              <strong>How it works:</strong> Your analytics are compressed and encoded directly into the URL. No server upload needed - completely private!
            </p>
          </div>

          {/* Technical Details */}
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">Technical Details</summary>
            <div className="mt-2 space-y-1 pl-4">
              <p>• Includes: Top 10 artists, top 10 tracks, and overall statistics</p>
              <p>• Compression: MessagePack + Pako (deflate)</p>
              <p>• Encoding: Base64 URL-safe</p>
              <p>• Data Size: {encoded.length} characters (compressed)</p>
            </div>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  );
}

