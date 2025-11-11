/**
 * Formatting Utilities
 * Helper functions for formatting numbers, durations, and display strings
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TIME_UNITS } from '@/shared/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TimeUnit = 'minutes' | 'hours';

/**
 * Format minutes into a human-readable string
 * @param minutes - Total minutes
 * @param unit - Display unit ('minutes' or 'hours')
 */
export function formatMinutes(minutes: number, unit: TimeUnit = 'minutes'): string {
  if (unit === 'hours') {
    const hours = Math.floor(minutes / TIME_UNITS.minutesPerHour);
    const mins = Math.round(minutes % TIME_UNITS.minutesPerHour);
    if (hours > 0) {
      return mins > 0 ? `${formatNumber(hours)}h ${mins}m` : `${formatNumber(hours)}h`;
    }
    return `${mins}m`;
  }

  // Default: minutes
  return `${formatNumber(Math.round(minutes))} min`;
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / TIME_UNITS.msPerSecond);
  const minutes = Math.floor(seconds / TIME_UNITS.secondsPerMinute);
  const hours = Math.floor(minutes / TIME_UNITS.minutesPerHour);
  const days = Math.floor(hours / TIME_UNITS.hoursPerDay);

  if (days > 0) {
    return `${days}d ${hours % TIME_UNITS.hoursPerDay}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % TIME_UNITS.minutesPerHour}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % TIME_UNITS.secondsPerMinute}s`;
  }
  return `${seconds}s`;
}

export function msToHours(ms: number): number {
  return Math.round(ms / TIME_UNITS.msPerHour);
}

export function msToMinutes(ms: number): number {
  return Math.round(ms / TIME_UNITS.msPerMinute);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
