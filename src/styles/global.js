// File: src/styles/global.js
import { useColorScheme, Dimensions, StyleSheet } from 'react-native';

// Device dimensions
export const { width, height } = Dimensions.get('window');

// Color palette
export const Colors = {
  light: {
    background: '#FFFFFF',
    primary: '#1DB954',
    secondary: '#121212',
    text: '#121212',
    card: '#F2F2F2',
    accent: '#FF6B6B',
  },
  dark: {
    background: '#121212',
    primary: '#1DB954',
    secondary: '#FFFFFF',
    text: '#FFFFFF',
    card: '#1E1E1E',
    accent: '#FF6B6B',
  },
};

// Font sizes
export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 28,
};

// Spacing
export const Spacing = {
  tiny: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

// Utility hook to get current theme colors
export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
};

// Common styles
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: Spacing.medium,
  },
  card: {
    borderRadius: 12,
    padding: Spacing.medium,
    marginVertical: Spacing.small,
    backgroundColor: Colors.light.card,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  text: {
    fontSize: FontSizes.medium,
    color: Colors.light.text,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});
