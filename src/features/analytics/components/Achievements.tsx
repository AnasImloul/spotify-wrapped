import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Trophy, Award, Star, Sparkles, Lock } from 'lucide-react';
import { useSpotifyData, useDateRange } from '@/shared/hooks';
import { calculateAchievements, Achievement } from '@/lib/achievements';
import { cn } from '@/shared/utils';

type FilterCategory = 'all' | Achievement['category'];

export function Achievements() {
  const { stats, streamingHistory } = useSpotifyData();
  const { startDate, endDate } = useDateRange();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');

  const achievements = useMemo(() => {
    if (!stats || !streamingHistory) return [];
    return calculateAchievements(stats, streamingHistory);
  }, [stats, streamingHistory, startDate, endDate]);

  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'all') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [achievements, selectedCategory]);

  const categories: { id: FilterCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Trophy className="w-4 h-4" /> },
    { id: 'listening', label: 'Listening', icon: <Star className="w-4 h-4" /> },
    { id: 'discovery', label: 'Discovery', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'dedication', label: 'Dedication', icon: <Award className="w-4 h-4" /> },
    { id: 'variety', label: 'Variety', icon: <Trophy className="w-4 h-4" /> },
    { id: 'special', label: 'Special', icon: <Star className="w-4 h-4" /> },
  ];

  const tierColors = {
    bronze: 'from-amber-700 to-amber-900',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-cyan-400 to-blue-600',
    diamond: 'from-purple-400 to-pink-600',
  };

  const tierBorderColors = {
    bronze: 'border-amber-700/50',
    silver: 'border-gray-400/50',
    gold: 'border-yellow-400/50',
    platinum: 'border-cyan-400/50',
    diamond: 'border-purple-400/50',
  };

  if (!stats) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-7 h-7 text-yellow-400" />
              Achievements
            </CardTitle>
            <CardDescription className="text-white/60 mt-2">
              Milestones you've reached throughout your listening history
            </CardDescription>
            <div className="mt-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-green-500/30">
                <Trophy className="w-3 h-3 mr-1" />
                {unlockedCount} / {totalCount} Unlocked
              </Badge>
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'gap-2 transition-all',
                  selectedCategory === category.id 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'text-white/70 hover:text-white border-white/20 hover:bg-white/10'
                )}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No achievements in this category yet</p>
            <p className="text-sm mt-1">Keep listening to unlock more!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  'relative rounded-lg p-4 border-2 transition-all duration-300',
                  achievement.unlocked
                    ? `bg-gradient-to-br ${tierColors[achievement.tier]}/20 ${tierBorderColors[achievement.tier]} hover:scale-105 cursor-pointer`
                    : 'bg-white/5 border-white/10 opacity-60'
                )}
              >
                {/* Tier Badge */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-[10px] px-2 py-0.5 font-bold uppercase',
                      achievement.unlocked
                        ? `bg-gradient-to-r ${tierColors[achievement.tier]} text-white border-0`
                        : 'bg-white/5 text-white/40 border-white/10'
                    )}
                  >
                    {achievement.tier}
                  </Badge>
                </div>

                {/* Icon */}
                <div className="text-4xl mb-3 flex items-center">
                  {achievement.unlocked ? (
                    <span className="animate-bounce-slow">{achievement.icon}</span>
                  ) : (
                    <Lock className="w-8 h-8 text-white/20" />
                  )}
                </div>

                {/* Content */}
                <h3 className={cn(
                  'font-bold text-lg mb-1',
                  achievement.unlocked ? 'text-white' : 'text-white/40'
                )}>
                  {achievement.title}
                </h3>
                <p className={cn(
                  'text-sm',
                  achievement.unlocked ? 'text-white/70' : 'text-white/30'
                )}>
                  {achievement.description}
                </p>

                {/* Progress Bar (if applicable) */}
                {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                )}

                {/* Unlocked indicator */}
                {achievement.unlocked && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-br from-green-400 to-green-600 rounded-full p-1.5 shadow-lg">
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievement Stats */}
        {filteredAchievements.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(['bronze', 'silver', 'gold', 'platinum', 'diamond'] as const).map(tier => {
              const count = achievements.filter(a => a.tier === tier && a.unlocked).length;
              return (
                <div
                  key={tier}
                  className={cn(
                    'rounded-lg p-3 border-2 text-center',
                    `bg-gradient-to-br ${tierColors[tier]}/10 ${tierBorderColors[tier]}`
                  )}
                >
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-xs text-white/60 capitalize mt-1">{tier}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

