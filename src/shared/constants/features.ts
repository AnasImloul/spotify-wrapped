/**
 * Feature Flags and Configuration
 * Feature flags moved from lib/featureFlags.ts
 */

export const FEATURE_FLAGS = {
  STORY_MODE: true,
  EXPORT_PDF: true,
  EXPORT_IMAGE: true,
  SHARE_LINK: true,
  YEAR_OVER_YEAR: true,
  MOOD_ENERGY_ANALYSIS: true,
  ACHIEVEMENTS: true,
  DISCOVERY_TIMELINE: true,
  LISTENING_STREAK: true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURE_FLAGS[feature] ?? false;
}

export const APP_CONFIG = {
  name: 'Spotify Wrapped Analytics',
  shortName: 'Spotify Wrapped',
  description: 'Your Year in Music, Visualized',
  version: '1.0.0',
  author: 'Your Name',
} as const;

export const STORAGE_KEYS = {
  tourCompleted: 'tourCompleted',
  welcomeShown: 'welcomeShown',
  theme: 'theme',
  lastUploadDate: 'lastUploadDate',
} as const;

