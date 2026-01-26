/**
 * Tufte-Tschichold Design System
 *
 * Principles:
 * 1. Maximize data-ink ratio
 * 2. Erase non-data-ink
 * 3. Erase redundant data-ink
 * 4. Use clear, legible typography
 * 5. Employ functional minimalism
 */

export const TufteColors = {
  // Neutral tones (Tschichold palette)
  background: '#FAFAFA',
  paper: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // Functional colors (minimal, purposeful)
  dataLine: '#1A1A1A',
  dataAccent: '#DC143C', // Crimson for emphasis
  grid: '#E0E0E0',
  border: '#CCCCCC',

  // Semantic colors (restrained)
  success: '#2E7D32',
  warning: '#F57C00',
  error: '#C62828',

  // Chart colors (distinguishable, not garish)
  chart1: '#1A1A1A',
  chart2: '#666666',
  chart3: '#999999',
  chartEmphasis: '#DC143C',
};

export const TufteTypography = {
  // Serif for body text (Tschichold preference)
  fontFamily: {
    serif: 'Georgia, Palatino, "Times New Roman", serif',
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Menlo, Consolas, Monaco, "Courier New", monospace',
  },

  // Typographic scale (modular)
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 21,
    xxl: 28,
    display: 36,
  },

  // Line height for readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65,
  },

  // Font weights (minimal palette)
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const TufteSpacing = {
  // 8-point grid system
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TufteLayout = {
  // Max width for optimal line length (45-75 chars)
  maxWidth: 680,

  // Margins (generous whitespace)
  marginHorizontal: 20,
  marginVertical: 32,

  // Border radius (subtle)
  borderRadius: 2,

  // Shadows (minimal)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

export const TufteChartConfig = {
  // Remove chartjunk
  backgroundColor: TufteColors.paper,
  backgroundGradientFrom: TufteColors.paper,
  backgroundGradientTo: TufteColors.paper,

  // Data ink (high contrast)
  color: (opacity = 1) => `rgba(26, 26, 26, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(26, 26, 26, ${opacity})`,

  // Minimal decoration
  decimalPlaces: 1,
  propsForBackgroundLines: {
    strokeDasharray: '', // Solid, not dashed
    stroke: TufteColors.grid,
    strokeWidth: 0.5,
  },
  propsForLabels: {
    fontSize: 11,
    fontFamily: TufteTypography.fontFamily.sans,
  },

  // No fills, lines only
  fillShadowGradient: TufteColors.paper,
  fillShadowGradientOpacity: 0,

  // Emphasis
  propsForDots: {
    r: '0', // No dots by default
  },
};
