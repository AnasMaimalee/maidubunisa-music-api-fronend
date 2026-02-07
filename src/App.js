// File: src/App.js
import React, { useEffect, useState, useMemo } from 'react';
import { Appearance, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import StackNavigator from './navigation/StackNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Colors } from './styles/global';

export default function App() {
  const colorScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');

  // Memoize context value
  const themeContextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  // Listen to system theme changes
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || 'light');
    });
    return () => listener.remove();
  }, []);

  // Setup TrackPlayer only for mobile
  useEffect(() => {
    if (Platform.OS !== 'web') {
      async function setupPlayer() {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            TrackPlayer.CAPABILITY_STOP,
          ],
        });
      }
      setupPlayer();
      return () => TrackPlayer.destroy();
    }
  }, []);

  return (
    <ThemeProvider value={themeContextValue}>
      <FavoritesProvider>
        <NavigationContainer>
          {Platform.OS !== 'web' && (
            <StatusBar
              barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
              backgroundColor={Colors[theme].background}
            />
          )}
          <StackNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
