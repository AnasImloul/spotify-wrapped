/**
 * Date Constants
 * Centralized date formatting and calculation constants
 */

export const DATE_FORMATS = {
  yearMonth: 'YYYY-MM',
  fullDate: 'YYYY-MM-DD',
  displayMonth: 'MMM YYYY',
  displayDate: 'MMM D, YYYY',
  iso: 'ISO',
} as const;

export const TIME_UNITS = {
  msPerSecond: 1000,
  msPerMinute: 60000,
  msPerHour: 3600000,
  msPerDay: 86400000,
  secondsPerMinute: 60,
  minutesPerHour: 60,
  hoursPerDay: 24,
} as const;

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;
