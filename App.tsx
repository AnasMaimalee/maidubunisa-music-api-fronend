// App.tsx - GLOBAL PLAYER ON ALL SCREENS
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Audio from 'expo-av';

import MainScreen from './src/screens/MainScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SettingsScreen from './app/(tabs)/settings';
import GlobalPlayer from './src/components/GlobalPlayer'; // 🔥 NEW

import { TrackPlayerProvider } from './src/context/TrackPlayerContext';
import { ThemeProvider } from './src/context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  Player: { song: any };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 🔥 WRAPPER - Adds GlobalPlayer to every screen
function ScreenWithPlayer({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlobalPlayer />
    </>
  );
}

export default function App() {
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    }).catch(console.error);
  }, []);

  return (
    <ThemeProvider>
      <TrackPlayerProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen 
              name="Home" 
              component={(props) => (
                <ScreenWithPlayer>
                  <MainScreen {...props} />
                </ScreenWithPlayer>
              )} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Player" 
              component={(props) => (
                <ScreenWithPlayer>
                  <PlayerScreen {...props} />
                </ScreenWithPlayer>
              )} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Settings" 
              component={(props) => (
                <ScreenWithPlayer>
                  <SettingsScreen {...props} />
                </ScreenWithPlayer>
              )} 
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TrackPlayerProvider>
    </ThemeProvider>
  );
}
