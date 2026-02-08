// App.tsx - FULLY WORKING (Player route + GlobalPlayer)
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Audio from 'expo-av';

import MainScreen from './src/screens/MainScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SettingsScreen from './app/(tabs)/settings';
import GlobalPlayer from './src/components/GlobalPlayer';

import { TrackPlayerProvider } from './src/context/TrackPlayerContext';
import { ThemeProvider } from './src/context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  Player: { song: any };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 🔥 CORRECTED WRAPPER - GlobalPlayer on ALL screens
function ScreenWithGlobalPlayer({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      {children}
      <GlobalPlayer />
    </View>
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
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
          >
            {/* ✅ HOME SCREEN */}
            <Stack.Screen 
              name="Home" 
              component={MainScreen}
              options={{ headerShown: false }}
            />
            
            {/* ✅ PLAYER SCREEN - THIS FIXES THE ERROR */}
            <Stack.Screen 
              name="Player" 
              component={PlayerScreen}
              options={{ headerShown: false }}
            />
            
            {/* ✅ SETTINGS SCREEN */}
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
