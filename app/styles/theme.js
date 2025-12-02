import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// Määrittele sovelluksen teema
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',
    primaryContainer: '#D6E4FF',
    secondary: '#D81B60',
    secondaryContainer: '#FFD8E4',
    tertiary: '#6F5B40',
    tertiaryContainer: '#FFDDBF',
    background: '#FFFBFE',
    surface: '#FFFFFF',
    surfaceVariant: '#E7E0EC',
    error: '#B3261E',
    errorContainer: '#F9DEDC',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onBackground: '#1C1B1F',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454E',
    outline: '#79747E',
    outlineVariant: '#CAC7D0',
    scrim: '#000000',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#B3E5FC',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
  },
  roundness: 12,
  fonts: {
    displayLarge: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    displayMedium: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
    },
    displaySmall: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 32,
    },
    headlineLarge: {
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 28,
    },
    headlineMedium: {
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 26,
    },
    headlineSmall: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    titleLarge: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    titleMedium: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
    },
    titleSmall: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    labelLarge: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
    },
    labelMedium: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
    labelSmall: {
      fontSize: 11,
      fontWeight: '500',
      lineHeight: 16,
    },
  },
};