import { StoryCard } from '../components/StoryCard';
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
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 px-4">
        {/* Icon */}
        <div className="relative">
          <div
            className={`absolute inset-0 bg-${timeOfDay === 'night' ? 'indigo' : 'orange'}-500/30 blur-3xl rounded-full`}
          />
          <div
            className={`relative bg-gradient-to-br from-${timeOfDay === 'night' ? 'indigo' : 'yellow'}-400 to-${timeOfDay === 'night' ? 'purple' : 'orange'}-600 p-5 sm:p-6 md:p-7 rounded-full`}
          >
            <Icon className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
          </div>
        </div>

        {/* Label */}
        <div className="space-y-1 sm:space-y-2">
          <p
            className={`${config.color} text-lg sm:text-xl md:text-2xl font-medium tracking-wide uppercase`}
          >
            Your Listening Time
          </p>
          <div
            className={`w-20 sm:w-24 md:w-28 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-${timeOfDay === 'night' ? 'indigo' : 'orange'}-400 to-transparent mx-auto`}
          />
        </div>

        {/* Time of day */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">{config.label}</h1>
        </div>

        {/* Peak hour */}
        <div className="space-y-2 sm:space-y-3">
          <p className="text-white/70 text-lg sm:text-xl md:text-2xl">Peak listening at</p>
          <p className={`text-4xl sm:text-5xl md:text-6xl font-bold ${config.color}`}>
            {formatHour(peakHour)}
          </p>
        </div>

        {/* Description */}
        <div className="px-5 sm:px-6 md:px-7 py-3 sm:py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md">
          <p className={`${config.color} text-base sm:text-lg md:text-xl font-semibold`}>
            {config.description}
          </p>
        </div>
      </div>
    </StoryCard>
  );
}
