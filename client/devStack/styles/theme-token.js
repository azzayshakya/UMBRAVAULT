import { theme } from 'antd'

export const PRIMITIVES = {
  green50: '#e8fff0',
  green100: '#c3ffda',
  green300: '#7dffb0',
  green500: '#22e07a',
  green600: '#16a34a',
  green700: '#0f7a37',
  white: '#ffffff',
  gray50: '#f7faf8',
  gray100: '#eef4f0',
  gray200: '#dbe6df',
  gray300: '#c1d1c6',
  gray400: '#8fa696',
  gray500: '#647a6a',
  gray600: '#4a5c4f',
  gray700: '#334035',
  gray800: '#1c2620',
  gray850: '#141d17',
  gray900: '#0d140f',
  gray950: '#080b09',
  red500: '#ef4444',
  amber500: '#f59e0b',
  emerald500: '#10b981',
}

export const getAntdTheme = (scheme) => {
  const isDark = scheme === 'dark'

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      // Brand
      colorPrimary: isDark ? PRIMITIVES.green300 : PRIMITIVES.green600,
      colorPrimaryHover: isDark ? PRIMITIVES.green100 : PRIMITIVES.green700,
      colorPrimaryBg: isDark ? 'rgba(34, 224, 122, 0.15)' : PRIMITIVES.green50,

      // Backgrounds
      colorBgLayout: isDark ? PRIMITIVES.gray950 : PRIMITIVES.gray50,
      colorBgContainer: isDark ? PRIMITIVES.gray900 : PRIMITIVES.white,
      colorBgElevated: isDark ? PRIMITIVES.gray850 : PRIMITIVES.white,

      // Text
      colorText: isDark ? PRIMITIVES.gray50 : PRIMITIVES.gray900,
      colorTextSecondary: isDark ? PRIMITIVES.gray400 : PRIMITIVES.gray600,
      colorTextTertiary: isDark ? PRIMITIVES.gray500 : PRIMITIVES.gray400,

      // Borders
      colorBorder: isDark ? PRIMITIVES.gray800 : PRIMITIVES.gray200,
      colorBorderSecondary: isDark ? PRIMITIVES.gray700 : PRIMITIVES.gray300,

      // Status
      colorError: PRIMITIVES.red500,
      colorWarning: PRIMITIVES.amber500,
      colorSuccess: PRIMITIVES.emerald500,

      // Layout defaults
      borderRadius: 8,
      padding: 24,
    },
  }
}

export default getAntdTheme
