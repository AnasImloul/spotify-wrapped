import { useState, useEffect } from 'react';
import { Upload, FileJson, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { formatNumber } from '@/shared/utils';

interface DataLoadingProgressProps {
  fileName: string;
  totalEntries: number;
  processedEntries: number;
  stage: 'reading' | 'parsing' | 'processing' | 'complete';
}

export function DataLoadingProgress({
  fileName,
  totalEntries,
  processedEntries,
  stage,
}: DataLoadingProgressProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const progress = totalEntries > 0 ? (processedEntries / totalEntries) * 100 : 0;

  const stageLabels = {
    reading: 'Reading file',
    parsing: 'Parsing data',
    processing: 'Processing statistics',
    complete: 'Complete',
  };

  const stageColors = {
    reading: 'from-blue-500 to-cyan-600',
    parsing: 'from-purple-500 to-pink-600',
    processing: 'from-green-500 to-emerald-600',
    complete: 'from-yellow-500 to-orange-600',
  };

  return (
    <Card className="border-2 border-white/10 bg-black/40 backdrop-blur-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stageColors[stage]} flex items-center justify-center shadow-lg animate-pulse-soft`}>
              {stage === 'complete' ? (
                <FileJson className="w-6 h-6 text-white" />
              ) : (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate">
                {stageLabels[stage]}{dots}
              </h3>
              <p className="text-sm text-white/60 truncate">{fileName}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">
                {formatNumber(processedEntries)} / {formatNumber(totalEntries)} entries
              </span>
              <span className="text-white/70 font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${stageColors[stage]} h-full transition-all duration-300 ease-out rounded-full relative overflow-hidden`}
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Stage indicators */}
          <div className="flex items-center justify-between pt-2">
            {(['reading', 'parsing', 'processing', 'complete'] as const).map((s, index) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    stage === s
                      ? `border-white bg-gradient-to-br ${stageColors[s]} text-white`
                      : index < ['reading', 'parsing', 'processing', 'complete'].indexOf(stage)
                      ? 'border-green-500/50 bg-green-500/20 text-green-400'
                      : 'border-white/20 bg-white/5 text-white/40'
                  }`}
                >
                  {s === 'reading' && <Upload className="w-4 h-4" />}
                  {s === 'parsing' && <FileJson className="w-4 h-4" />}
                  {s === 'processing' && <Loader2 className="w-4 h-4" />}
                  {s === 'complete' && <span className="text-xs font-bold">✓</span>}
                </div>
                <span className="text-[10px] text-white/60 hidden sm:block">
                  {stageLabels[s].split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Add shimmer animation to index.css

