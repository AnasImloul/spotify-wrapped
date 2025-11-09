/**
 * Social media sharing utilities
 */

export type SocialPlatform = 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'whatsapp' | 'telegram';

interface ShareOptions {
  url?: string;
  text?: string;
  hashtags?: string[];
  via?: string;
}

/**
 * Generate platform-specific share URLs
 */
export function generateShareUrl(platform: SocialPlatform, options: ShareOptions): string {
  const { url = window.location.href, text = '', hashtags = [], via } = options;
  
  const encodedUrl = encodeURIComponent(url);
  
  switch (platform) {
    case 'twitter':
      const twitterParams = new URLSearchParams();
      twitterParams.set('text', text);
      if (url) twitterParams.set('url', url);
      if (hashtags.length > 0) twitterParams.set('hashtags', hashtags.join(','));
      if (via) twitterParams.set('via', via);
      return `https://twitter.com/intent/tweet?${twitterParams.toString()}`;
    
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    
    case 'linkedin':
      const linkedinParams = new URLSearchParams();
      linkedinParams.set('url', url);
      linkedinParams.set('title', text);
      return `https://www.linkedin.com/sharing/share-offsite/?${linkedinParams.toString()}`;
    
    case 'reddit':
      const redditParams = new URLSearchParams();
      redditParams.set('url', url);
      redditParams.set('title', text);
      return `https://www.reddit.com/submit?${redditParams.toString()}`;
    
    case 'whatsapp':
      const whatsappText = text + (url ? ` ${url}` : '');
      return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    
    case 'telegram':
      const telegramParams = new URLSearchParams();
      telegramParams.set('url', url);
      telegramParams.set('text', text);
      return `https://t.me/share/url?${telegramParams.toString()}`;
    
    default:
      return '';
  }
}

/**
 * Open share dialog in a new window
 */
export function openShareWindow(url: string, width: number = 600, height: number = 400): void {
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  
  window.open(
    url,
    'share-dialog',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
}

/**
 * Copy image blob to clipboard
 */
export async function copyImageToClipboard(blob: Blob): Promise<void> {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error('Clipboard API not supported in this browser');
  }
  
  const item = new ClipboardItem({ [blob.type]: blob });
  await navigator.clipboard.write([item]);
}

/**
 * Copy text to clipboard
 */
export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Generate shareable stats text
 */
export function generateStatsText(data: {
  topArtist?: string;
  topTrack?: string;
  trackArtist?: string;
  totalMinutes?: number;
  totalHours?: number;
  uniqueArtists?: number;
  uniqueTracks?: number;
  streak?: number;
}): string {
  const lines: string[] = ['🎵 My Spotify Wrapped'];
  
  if (data.topArtist) {
    lines.push(`🎤 Top Artist: ${data.topArtist}`);
  }
  
  if (data.topTrack && data.trackArtist) {
    lines.push(`🎧 Top Track: ${data.topTrack} - ${data.trackArtist}`);
  }
  
  if (data.totalHours) {
    lines.push(`⏱️ Total Listening: ${data.totalHours.toLocaleString()}h`);
  }
  
  if (data.uniqueArtists) {
    lines.push(`🎨 Artists Explored: ${data.uniqueArtists.toLocaleString()}`);
  }
  
  if (data.uniqueTracks) {
    lines.push(`💿 Tracks Played: ${data.uniqueTracks.toLocaleString()}`);
  }
  
  if (data.streak && data.streak > 1) {
    lines.push(`🔥 Longest Streak: ${data.streak} days`);
  }
  
  lines.push('');
  lines.push('Made with Spotify Wrapped Analytics');
  
  return lines.join('\n');
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Use native Web Share API if available
 */
export async function nativeShare(data: {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}): Promise<void> {
  if (!isWebShareSupported()) {
    throw new Error('Web Share API not supported');
  }
  
  await navigator.share(data);
}

