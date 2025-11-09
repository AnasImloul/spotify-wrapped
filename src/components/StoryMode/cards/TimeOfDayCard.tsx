import { StoryCard } from '../StoryCard';
import { Sun, Sunset, Moon, Coffee } from 'lucide-react';

interface TimeOfDayCardProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  peakHour: number;
}

const timeOfDayConfig = {
  morning: {
    icon: Coffee,
    gradient: 'from-yellow-900/40 via-orange-800/30 to-yellow-700/20',
    label: 'Morning Vibes',
    description: 'You start your day with music',
    color: 'text-yellow-300',
  },
  afternoon: {
    icon: Sun,
    gradient: 'from-amber-900/40 via-yellow-800/30 to-orange-700/20',
    label: 'Afternoon Energy',
    description: 'Midday tunes keep you going',
    color: 'text-amber-300',
  },
  evening: {
    icon: Sunset,
    gradient: 'from-orange-900/40 via-pink-800/30 to-purple-700/20',
    label: 'Evening Grooves',
    description: 'Sunset soundtrack enthusiast',
    color: 'text-orange-300',
  },
  night: {
    icon: Moon,
    gradient: 'from-indigo-900/40 via-purple-800/30 to-blue-700/20',
    label: 'Night Owl',
    description: 'Late night listening sessions',
    color: 'text-indigo-300',
  },
};

export function TimeOfDayCard({ timeOfDay, peakHour }: TimeOfDayCardProps) {
  const config = timeOfDayConfig[timeOfDay];
  const Icon = config.icon;
  
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <StoryCard gradient={config.gradient} exportId="story-time-of-day">
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 lg:space-y-8 xl:space-y-10 px-4">
        {/* Icon */}
        <div className="relative">
          <div className={`absolute inset-0 bg-${timeOfDay === 'night' ? 'indigo' : 'orange'}-500/30 blur-3xl rounded-full`} />
          <div className={`relative bg-gradient-to-br from-${timeOfDay === 'night' ? 'indigo' : 'yellow'}-400 to-${timeOfDay === 'night' ? 'purple' : 'orange'}-600 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-full`}>
            <Icon className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p className={`${config.color} text-base sm:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide uppercase`}>
            Your Listening Time
          </p>
          <div className={`w-16 sm:w-20 lg:w-24 xl:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-${timeOfDay === 'night' ? 'indigo' : 'orange'}-400 to-transparent mx-auto`} />
        </div>

        {/* Time of day */}
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white">
            {config.label}
          </h1>
        </div>

        {/* Peak hour */}
        <div className="space-y-2 sm:space-y-3">
          <p className="text-white/70 text-base sm:text-lg lg:text-xl xl:text-2xl">Peak listening at</p>
          <p className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold ${config.color}`}>
            {formatHour(peakHour)}
          </p>
        </div>

        {/* Description */}
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 lg:py-5 xl:py-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md lg:max-w-lg xl:max-w-xl">
          <p className={`${config.color} text-sm sm:text-base lg:text-lg xl:text-xl font-semibold`}>
            {config.description}
          </p>
        </div>
      </div>
    </StoryCard>
  );
}

