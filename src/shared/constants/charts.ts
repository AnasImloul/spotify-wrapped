/**
 * Chart Constants
 * Colors, themes, and configurations for data visualizations
 */

export const CHART_COLORS = {
  primary: '#1ED760',
  secondary: '#509BF5',
  accent: '#FFC864',
  text: '#FFFFFF',
  textMuted: '#B3B3B3',
  background: '#121212',
  backgroundLight: '#181818',
  grid: '#2B2B2B',
  axis: '#525252',
} as const;

export const CHART_SERIES = [
  '#1ED760',
  '#509BF5',
  '#FFC864',
  '#FF6437',
  '#FFFFFF',
  '#B3B3B3',
  '#2E9E58',
  '#3A6FB0',
] as const;

export const CHART_AXIS = {
  stroke: CHART_COLORS.grid,
  tick: { fill: CHART_COLORS.textMuted, fontSize: 11 },
  tickLine: false,
} as const;

export const CHART_GRID = {
  stroke: CHART_COLORS.grid,
  vertical: false,
} as const;

export const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: '#1C1C1C',
    border: `1px solid ${CHART_COLORS.axis}`,
    borderRadius: 0,
    color: CHART_COLORS.text,
    fontSize: 12,
    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
  },
  labelStyle: { color: CHART_COLORS.textMuted, marginBottom: 4 },
  itemStyle: { color: CHART_COLORS.text, padding: 0 },
  cursor: { stroke: CHART_COLORS.axis, fill: 'rgba(255, 255, 255, 0.04)' },
} as const;

export const CHART_THEME = {
  spotify: {
    colors: [...CHART_SERIES],
    background: CHART_COLORS.background,
    text: CHART_COLORS.text,
  },
} as const;

export const HEATMAP_COLORS = {
  low: 'rgba(30, 215, 96, 0.12)',
  medium: 'rgba(30, 215, 96, 0.4)',
  high: 'rgba(30, 215, 96, 0.7)',
  highest: 'rgba(30, 215, 96, 1)',
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
