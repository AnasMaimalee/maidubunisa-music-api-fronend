// File: src/styles/global.js
import { Dimensions, StyleSheet } from 'react-native';

// Device dimensions
export const { width, height } = Dimensions.get('window');

// Color palette (ONLY LIGHT MODE)
export const Colors = {
  primary: '#1DB954', // main green
  secondary: '#121212',
  text: '#121212',
  background: '#FFFFFF',
  card: '#F2F2F2',
  accent: '#FF6B6B',
};

// Fonts
export const Fonts = {
  rounded: 'System', // can replace with custom font if you load one
  mono: 'Courier',
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

// Remove the theme hook completely
export const useThemeColors = () => Colors;

// Common styles
export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.medium,
  },
  card: {
    borderRadius: 12,
    padding: Spacing.medium,
    marginVertical: Spacing.small,
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  text: {
    fontSize: FontSizes.medium,
    color: Colors.text,
  },
  title: {
    fontSize: FontSizes.large,
    fontWeight: 'bold',
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
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
