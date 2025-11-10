import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ProcessedStats } from '@/shared/types';
import { Sparkles, Music } from 'lucide-react';
import { getMonthName } from '@/shared/utils';

interface MusicEvolutionProps {
  stats: ProcessedStats;
}

export function MusicEvolution({ stats }: MusicEvolutionProps) {
  if (!stats.musicEvolution?.eras || stats.musicEvolution.eras.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-green-500/30">
      <CardHeader className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-b border-green-500/20">
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-green-400" />
          Your Musical Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {stats.musicEvolution.eras.map((era, index) => (
            <div
              key={era.key}
              className="relative p-6 rounded-lg border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] hover:shadow-2xl hover:border-green-500/30 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {index + 1}
              </div>
              
              <div className="ml-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-white">
                      {getMonthName(era.peakMonth - 1)} Era
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize bg-green-500/20 text-green-300 border-green-500/30">
                        {era.genre}
                      </Badge>
                      <Badge variant="outline" className="capitalize border-green-500/20 text-green-300">
                        {era.mood}
                      </Badge>
                      <Badge variant="outline" className="capitalize border-white/20 text-white/80">
                        {era.descriptor}
                      </Badge>
                    </div>
                  </div>
                </div>

                {era.tracks && era.tracks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-white/60">
                      Defining Tracks:
                    </p>
                    <div className="space-y-2">
                      {era.tracks.map((track, trackIndex) => (
                        <div
                          key={trackIndex}
                          className="flex items-center gap-2 text-sm p-2 rounded bg-white/5 border border-white/10"
                        >
                          <Music className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="font-medium text-white">{track.trackName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

