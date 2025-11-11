import {
  PersonalRecords,
  ListeningStreak,
  MoodEnergyAnalysis,
  YearOverYearComparison,
} from '@/features/analytics';
import { Trophy, Flame, Sparkles, BarChart3 } from 'lucide-react';

export default function DeepDivePage() {
  return (
    <div className="space-y-12 animate-fade-in">
      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Personal Records
        </h3>
        <PersonalRecords />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Flame className="w-8 h-8 text-orange-400" />
          Listening Consistency
        </h3>
        <ListeningStreak />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Mood & Energy
        </h3>
        <MoodEnergyAnalysis />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

      <div>
        <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-400" />
          Year-over-Year Analysis
        </h3>
        <YearOverYearComparison />
      </div>
    </div>
  );
}
