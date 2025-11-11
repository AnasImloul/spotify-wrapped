import { useState } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { elementToCanvas, canvasToBlob } from '@/shared/services/export';
import {
  generateShareUrl,
  openShareWindow,
  copyImageToClipboard,
  copyTextToClipboard,
  generateStatsText,
  isWebShareSupported,
  nativeShare,
  type SocialPlatform,
} from '@/lib/social';
import type { StoryInsights } from '@/features/story-mode/hooks/useStoryData';

interface ShareMenuProps {
  elementId: string;
  cardName: string;
  storyData: StoryInsights;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShareMenu({
  elementId,
  cardName,
  storyData,
  variant = 'ghost',
  size = 'icon',
  className,
}: ShareMenuProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Generate shareable text
  const shareText = generateStatsText({
    topArtist: storyData.topArtist?.name,
    topTrack: storyData.topTrack?.name,
    trackArtist: storyData.topTrack?.artist,
    totalHours: Math.round(storyData.totalMinutes / 60),
    uniqueArtists: storyData.uniqueArtists,
    uniqueTracks: storyData.uniqueTracks,
    streak: storyData.listeningStreak,
  });

  // Handle platform-specific sharing
  const handlePlatformShare = async (platform: SocialPlatform) => {
    const text = `Check out my Spotify Wrapped - ${cardName}!`;
    const hashtags = ['SpotifyWrapped', 'Music', 'Spotify'];

    const shareUrl = generateShareUrl(platform, {
      text,
      hashtags,
      url: window.location.href,
    });

    openShareWindow(shareUrl);
  };

  // Handle native share (mobile)
  const handleNativeShare = async () => {
    if (!isWebShareSupported()) return;

    setIsSharing(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await elementToCanvas(element, { scale: 2 });
      const blob = await canvasToBlob(canvas, 'image/png');
      const file = new File([blob], `spotify-wrapped-${cardName}.png`, { type: 'image/png' });

      await nativeShare({
        title: `My Spotify Wrapped - ${cardName}`,
        text: shareText,
        files: [file],
      });
    } catch (error) {
      console.error('Native share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Copy image to clipboard
  const handleCopyImage = async () => {
    setIsSharing(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await elementToCanvas(element, { scale: 2 });
      const blob = await canvasToBlob(canvas, 'image/png');

      await copyImageToClipboard(blob);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (error) {
      console.error('Copy image failed:', error);
      alert('Failed to copy image. Your browser may not support this feature.');
    } finally {
      setIsSharing(false);
    }
  };

  // Copy text to clipboard
  const handleCopyText = async () => {
    try {
      await copyTextToClipboard(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (error) {
      console.error('Copy text failed:', error);
    }
  };

  // Download image
  const handleDownload = async () => {
    setIsSharing(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await elementToCanvas(element, { scale: 2 });
      const blob = await canvasToBlob(canvas, 'image/png');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `spotify-wrapped-${cardName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isSharing}>
          <Share2 className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share This Card</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Native share (mobile) */}
        {isWebShareSupported() && (
          <>
            <DropdownMenuItem onClick={handleNativeShare} disabled={isSharing}>
              <Share2 className="w-4 h-4 mr-2" />
              Share...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Social platforms */}
        <DropdownMenuItem onClick={() => handlePlatformShare('twitter')}>
          <Twitter className="w-4 h-4 mr-2" />
          Share on Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handlePlatformShare('facebook')}>
          <Facebook className="w-4 h-4 mr-2" />
          Share on Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handlePlatformShare('linkedin')}>
          <Linkedin className="w-4 h-4 mr-2" />
          Share on LinkedIn
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handlePlatformShare('whatsapp')}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Share on WhatsApp
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handlePlatformShare('telegram')}>
          <Send className="w-4 h-4 mr-2" />
          Share on Telegram
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Copy options */}
        <DropdownMenuItem onClick={handleCopyImage} disabled={isSharing}>
          {copiedImage ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Image Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Image
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyText}>
          {copiedText ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Text Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Stats as Text
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Download */}
        <DropdownMenuItem onClick={handleDownload} disabled={isSharing}>
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
