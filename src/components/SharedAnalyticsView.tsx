import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSharedDataFromUrl, clearShareFromUrl, type ShareableData } from '@/lib/urlSharing';
import { formatNumber } from '@/lib/utils';

interface SharedAnalyticsViewProps {
  onClose: () => void;
}

export function SharedAnalyticsView({ onClose }: SharedAnalyticsViewProps) {
  const [sharedData, setSharedData] = useState<ShareableData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSharedDataFromUrl();
    setSharedData(data);
    setLoading(false);
  }, []);

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
    clearShareFromUrl();
    onClose();
  };

  const handleGetOwn = () => {
    clearShareFromUrl();
    window.location.reload();
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
                {formatNumber(Math.round(sharedData.s.tt))}h
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Tracks Played</CardDescription>
              <CardTitle className="text-3xl text-blue-400">
                {formatNumber(sharedData.s.tc)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Artists Explored</CardDescription>
              <CardTitle className="text-3xl text-purple-400">
                {formatNumber(sharedData.s.ua)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="pb-3">
              <CardDescription className="text-white/60">Avg per Day</CardDescription>
              <CardTitle className="text-3xl text-orange-400">
                {formatNumber(Math.round(sharedData.s.ad))}m
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Top Artists */}
        {sharedData.a && sharedData.a.length > 0 && (
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                🎤 Top Artists
              </CardTitle>
              <CardDescription className="text-white/60">
                Most listened artists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sharedData.a.map((artist, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{artist.n}</p>
                        <p className="text-sm text-white/60">
                          {formatNumber(artist.p)} plays
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      {formatNumber(artist.m)} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Tracks */}
        {sharedData.t && sharedData.t.length > 0 && (
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                🎧 Top Tracks
              </CardTitle>
              <CardDescription className="text-white/60">
                Most played songs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sharedData.t.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">{track.n}</p>
                        <p className="text-sm text-white/60 truncate">{track.a}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm text-white/40 hidden sm:inline">
                        {formatNumber(track.p)} plays
                      </span>
                      <Badge variant="secondary">
                        {formatNumber(track.m)} min
                      </Badge>
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
                Upload your Spotify data and discover your unique listening patterns, top artists, and more!
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
          <p>No data was uploaded to any server - everything is processed locally in your browser.</p>
        </div>
      </main>
    </div>
  );
}

