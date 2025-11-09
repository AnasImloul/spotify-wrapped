/**
 * Feature flags for enabling/disabling features
 * Set to true to enable, false to disable
 */

export const FEATURE_FLAGS = {
  // Theme switcher (dark/light/auto modes)
  THEME_TOGGLE: false,
  
  // PWA install prompt
  PWA_INSTALL_PROMPT: true,
  
  // Onboarding tour
  ONBOARDING_TOUR: true,
  
  // Sample data feature
  SAMPLE_DATA: true,
  
  // Advanced features (to be implemented)
  ACHIEVEMENTS: false,
  GENRE_ANALYSIS: false,
  MUSIC_MAP: false,
  YEAR_COMPARISON: false,
  FRIEND_COMPARISON: false,
  PLAYLIST_GENERATOR: false,
  ADVANCED_SEARCH: false,
  
  // Experimental features
  AI_INSIGHTS: false,
  VOICE_SUMMARY: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: FeatureFlag): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature as FeatureFlag);
}

/**
 * Get all disabled features
 */
export function getDisabledFeatures(): FeatureFlag[] {
  return Object.entries(FEATURE_FLAGS)
    .filter(([_, enabled]) => !enabled)
    .map(([feature]) => feature as FeatureFlag);
}

