import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Download, Mic2, Headphones } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { getCompactDataFromUrl, expandCompactData } from '@/shared/services/sharing';
import { formatNumber } from '@/shared/utils';

interface SharedAnalyticsViewProps {
  onClose: () => void;
  shareId?: string;
}

export function SharedAnalyticsView({ onClose, shareId }: SharedAnalyticsViewProps) {
  const navigate = useNavigate();
  const [sharedData, setSharedData] = useState<ReturnType<typeof expandCompactData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compactData = getCompactDataFromUrl(shareId);
    if (compactData) {
      const expanded = expandCompactData(compactData);
      setSharedData(expanded);
    }
    setLoading(false);
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading shared analytics...</div>
      </div>
    );
  }

  if (!sharedData) {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const handleGetOwn = () => {
    // Navigate to home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Shared Spotify Analytics</h1>
              <p className="text-sm text-green-400">Someone shared their music stats with you!</p>
              {sharedData.dateRange && (
                <p className="text-xs text-white/50 mt-1">
                  {new Date(sharedData.dateRange.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(sharedData.dateRange.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGetOwn} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Get Your Own
              </Button>
              <Button onClick={handleClose} variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Total Listening Time</CardDescription>
              <CardTitle className="text-3xl text-green-400">
                {formatNumber(Math.round(sharedData.stats.totalListeningTime))}h
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Tracks Played</CardDescription>
              <CardTitle className="text-3xl text-blue-400">
                {formatNumber(sharedData.stats.totalTracks)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Artists Explored</CardDescription>
              <CardTitle className="text-3xl text-purple-400">
                {formatNumber(sharedData.stats.uniqueArtists)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Avg per Day</CardDescription>
              <CardTitle className="text-3xl text-orange-400">
                {formatNumber(Math.round(sharedData.stats.averageListeningPerDay))}m
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Top Artists */}
        {sharedData.topArtists && sharedData.topArtists.length > 0 && (
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Mic2 className="w-6 h-6 text-green-400" />
                Top Artists
              </CardTitle>
              <CardDescription className="text-white/60">Most listened artists</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sharedData.topArtists.map((artist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{artist.name}</p>
                        <p className="text-sm text-white/60">
                          {formatNumber(artist.playCount)} plays
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {formatNumber(artist.minutes)} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Tracks */}
        {sharedData.topTracks && sharedData.topTracks.length > 0 && (
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Headphones className="w-6 h-6 text-blue-400" />
                Top Tracks
              </CardTitle>
              <CardDescription className="text-white/60">Most played songs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sharedData.topTracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{track.name}</p>
                        <p className="text-sm text-white/60 truncate">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm text-white/40 hidden sm:inline">
                        {formatNumber(track.playCount)} plays
                      </span>
                      <Badge variant="secondary">{formatNumber(track.minutes)} min</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Want to see your own Spotify analytics?
              </h3>
              <p className="text-white/80">
                Upload your Spotify data and discover your unique listening patterns, top artists,
                and more!
              </p>
              <Button
                onClick={handleGetOwn}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Download className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-white/40 text-sm">
          <p>This analytics data was shared via URL encoding.</p>
          <p>
            No data was uploaded to any server - everything is processed locally in your browser.
          </p>
        </div>
      </main>
    </div>
  );
}
