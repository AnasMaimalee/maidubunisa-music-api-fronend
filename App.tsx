import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import MainScreen from './src/screens/MainScreen';
import PlayerScreen from './src/screens/PlayerScreen';

import { TrackPlayerProvider } from './src/context/TrackPlayerContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { FavoritesProvider } from './src/context/FavoritesContext'; // ✅ Import FavoritesProvider

export type RootStackParamList = {
  Home: undefined;
  Player: { trackId: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <TrackPlayerProvider>
        <FavoritesProvider> {/* ✅ Wrap the app with FavoritesProvider */}
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                name="Home"
                component={MainScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Player"
                component={PlayerScreen}
                options={{ title: 'Now Playing' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </TrackPlayerProvider>
    </ThemeProvider>
  );
}
