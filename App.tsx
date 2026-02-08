import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import MainScreen from './src/screens/MainScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SettingsScreen from './app/(tabs)/settings';

import { TrackPlayerProvider } from './src/context/TrackPlayerContext';
import { ThemeProvider } from './src/context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  Player: { trackId: string } | undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      {/* ⚡ Wrap the entire navigation container with TrackPlayerProvider */}
      <TrackPlayerProvider>
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
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TrackPlayerProvider>
    </ThemeProvider>
  );
}
