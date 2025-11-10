import { useMemo } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, Share2, Music, Headphones, Clock, Trophy, Sparkles } from 'lucide-react';
import { useFilteredStats, useDateRange } from '@/shared/hooks';
import { formatNumber, msToMinutes } from '@/shared/utils';
import html2canvas from 'html2canvas';

export function YearInReviewCard() {
  const stats = useFilteredStats();
  const { startDate, endDate } = useDateRange();

  const summary = useMemo(() => {
    if (!stats) return null;

    const totalMinutes = msToMinutes(stats.totalListeningTime * 60 * 60 * 1000);
    const totalHours = Math.round(totalMinutes / 60);
    const topArtist = stats.topArtists[0];
    const topTrack = stats.topTracks[0];

    // Get year from date range
    const startYear = new Date(startDate + '-01').getFullYear();
    const endYear = new Date(endDate + '-01').getFullYear();
    const year = startYear === endYear ? startYear.toString() : `${startYear}-${endYear}`;

    return {
      year,
      totalHours,
      totalMinutes,
      totalTracks: stats.totalTracks,
      totalArtists: stats.totalArtists,
      topArtist: topArtist ? {
        name: topArtist.name,
        plays: topArtist.playCount,
        minutes: Math.round(msToMinutes(topArtist.totalMs)),
      } : null,
      topTrack: topTrack ? {
        name: topTrack.name,
        artist: topTrack.artist,
        plays: topTrack.playCount,
      } : null,
      avgDaily: Math.round(stats.averageListeningPerDay || 0),
    };
  }, [stats, startDate, endDate]);

  const handleDownload = async () => {
    const element = document.getElementById('year-in-review-card');
    if (!element) {
      console.error('Element not found');
      return;
    }

    try {
      // Find the gradient text element and temporarily replace it with solid color
      const gradientText = element.querySelector('.bg-clip-text');
      let originalClasses = '';
      
      if (gradientText) {
        originalClasses = gradientText.className;
        // Replace gradient classes with solid green color
        gradientText.className = gradientText.className
          .replace('bg-gradient-to-r', '')
          .replace('from-green-400', '')
          .replace('to-blue-500', '')
          .replace('bg-clip-text', '')
          .replace('text-transparent', '')
          .trim() + ' text-green-400';
      }

      // Hide decorative blur elements during capture
      const blurElements = element.querySelectorAll('.blur-3xl');
      blurElements.forEach(el => (el as HTMLElement).style.display = 'none');

      // Remove truncate class temporarily to prevent text cutoff
      const truncateElements = element.querySelectorAll('.truncate');
      const originalTruncateClasses: string[] = [];
      truncateElements.forEach((el, index) => {
        originalTruncateClasses[index] = el.className;
        el.className = el.className.replace('truncate', '').trim();
      });

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      // Restore original classes and elements
      if (gradientText) {
        gradientText.className = originalClasses;
      }
      blurElements.forEach(el => (el as HTMLElement).style.display = '');
      truncateElements.forEach((el, index) => {
        el.className = originalTruncateClasses[index];
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `spotify-wrapped-${summary?.year}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleShare = async () => {
    const element = document.getElementById('year-in-review-card');
    if (!element) return;

    try {
      // Find the gradient text element and temporarily replace it with solid color
      const gradientText = element.querySelector('.bg-clip-text');
      let originalClasses = '';
      
      if (gradientText) {
        originalClasses = gradientText.className;
        // Replace gradient classes with solid green color
        gradientText.className = gradientText.className
          .replace('bg-gradient-to-r', '')
          .replace('from-green-400', '')
          .replace('to-blue-500', '')
          .replace('bg-clip-text', '')
          .replace('text-transparent', '')
          .trim() + ' text-green-400';
      }

      // Hide decorative blur elements during capture
      const blurElements = element.querySelectorAll('.blur-3xl');
      blurElements.forEach(el => (el as HTMLElement).style.display = 'none');

      // Remove truncate class temporarily to prevent text cutoff
      const truncateElements = element.querySelectorAll('.truncate');
      const originalTruncateClasses: string[] = [];
      truncateElements.forEach((el, index) => {
        originalTruncateClasses[index] = el.className;
        el.className = el.className.replace('truncate', '').trim();
      });

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      // Restore original classes and elements
      if (gradientText) {
        gradientText.className = originalClasses;
      }
      blurElements.forEach(el => (el as HTMLElement).style.display = '');
      truncateElements.forEach((el, index) => {
        el.className = originalTruncateClasses[index];
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `spotify-wrapped-${summary?.year}.png`, {
          type: 'image/png',
        });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: `My ${summary?.year} Wrapped`,
            text: `Check out my music stats for ${summary?.year}!`,
            files: [file],
          });
        } else {
          // Fallback to download
          handleDownload();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  if (!stats || !summary) return null;

  return (
    <Card className="bg-black/40 border-white/10 overflow-hidden">
      <CardContent className="p-0">
        {/* Shareable Card */}
        <div
          id="year-in-review-card"
          className="relative bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 p-8 sm:p-12"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                  <Music className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold text-white">
                {summary.year}
              </h2>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Wrapped
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Total Time */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Clock className="w-8 h-8 text-green-400 mb-3" />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {formatNumber(summary.totalHours)}
                </p>
                <p className="text-sm text-white/60">Hours Listened</p>
              </div>

              {/* Total Tracks */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Music className="w-8 h-8 text-blue-400 mb-3" />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {formatNumber(summary.totalTracks)}
                </p>
                <p className="text-sm text-white/60">Different Songs</p>
              </div>

              {/* Total Artists */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Headphones className="w-8 h-8 text-purple-400 mb-3" />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {formatNumber(summary.totalArtists)}
                </p>
                <p className="text-sm text-white/60">Artists Explored</p>
              </div>

              {/* Daily Average */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <Sparkles className="w-8 h-8 text-yellow-400 mb-3" />
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {summary.avgDaily}
                </p>
                <p className="text-sm text-white/60">Min Per Day</p>
              </div>
            </div>

            {/* Top Items */}
            {summary.topArtist && (
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-6 h-6 text-green-400" />
                  <p className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Top Artist
                  </p>
                </div>
                <p className="text-2xl font-bold text-white mb-2 truncate">
                  {summary.topArtist.name}
                </p>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <span>{formatNumber(summary.topArtist.plays)} plays</span>
                  <span>•</span>
                  <span>{formatNumber(summary.topArtist.minutes)} minutes</span>
                </div>
              </div>
            )}

            {summary.topTrack && (
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-6 h-6 text-blue-400" />
                  <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Top Track
                  </p>
                </div>
                <p className="text-2xl font-bold text-white mb-1 truncate">
                  {summary.topTrack.name}
                </p>
                <p className="text-white/60 mb-2 truncate">{summary.topTrack.artist}</p>
                <p className="text-white/70 text-sm">
                  {formatNumber(summary.topTrack.plays)} plays
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-white/40">
                Generated with Spotify Wrapped Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-black/60 backdrop-blur-lg border-t border-white/10">
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

