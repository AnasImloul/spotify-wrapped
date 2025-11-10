/**
 * Services Barrel Export
 * Central export point for all service modules
 */

export * from './data-processing';
export * from './analytics';
export * from './storage';
export * from './sharing';
export * from './export';

// Re-export commonly used functions from lib for backward compatibility
export { generateHeatmap, analyzeListeningPatterns } from '@/lib/analyticsProcessor';
export { generateMonthlyTrends } from '@/lib/analyticsProcessor';
export { detectFileType } from '@/lib/dataProcessor';
export type { UploadedFile } from '@/lib/dataProcessor';

