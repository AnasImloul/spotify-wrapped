/**
 * Date Utilities
 * Helper functions for date manipulation and formatting
 */

import { MONTHS, MONTH_ABBR } from '@/shared/constants';

export function getMonthName(monthIndex: number): string {
  return MONTHS[monthIndex] || '';
}

export function getMonthAbbr(monthIndex: number): string {
  return MONTH_ABBR[monthIndex] || '';
}

export function formatYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return `${getMonthAbbr(monthIndex)} ${year}`;
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getYearFromYearMonth(yearMonth: string): number {
  return parseInt(yearMonth.split('-')[0], 10);
}

export function getMonthFromYearMonth(yearMonth: string): number {
  return parseInt(yearMonth.split('-')[1], 10);
}
