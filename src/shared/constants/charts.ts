/**
 * Chart Constants
 * Colors, themes, and configurations for data visualizations
 */

export const CHART_COLORS = {
  primary: '#1db954',
  secondary: '#1ed760',
  accent: '#1aa34a',
  text: '#ffffff',
  textMuted: '#b3b3b3',
  background: '#121212',
  backgroundLight: '#282828',
  grid: 'rgba(255, 255, 255, 0.1)',
  gradient: {
    start: '#1db954',
    end: '#1ed760',
  },
} as const;

export const CHART_THEME = {
  spotify: {
    colors: ['#1db954', '#1ed760', '#1aa34a', '#17883e', '#126e33'],
    background: '#121212',
    text: '#ffffff',
  },
  rainbow: {
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'],
    background: '#121212',
    text: '#ffffff',
  },
  neon: {
    colors: ['#FF006E', '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B'],
    background: '#0a0a0a',
    text: '#ffffff',
  },
} as const;

export const HEATMAP_COLORS = {
  low: 'rgba(29, 185, 84, 0.1)',
  medium: 'rgba(29, 185, 84, 0.5)',
  high: 'rgba(29, 185, 84, 0.8)',
  highest: 'rgba(29, 185, 84, 1)',
} as const;

export const CHART_DEFAULTS = {
  height: 300,
  margin: { top: 20, right: 30, bottom: 20, left: 40 },
  animationDuration: 1000,
  tooltipOffset: 10,
} as const;

export const TOP_ITEMS_LIMITS = {
  default: 10,
  extended: 50,
  maximum: 100,
} as const;

