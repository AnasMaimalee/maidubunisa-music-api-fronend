// App.tsx - 100% PHONE AUDIO FIXED
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Audio from 'expo-av'; // 🔥 REQUIRED FOR PHONE SOUND

import MainScreen from './src/screens/MainScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import SettingsScreen from './app/(tabs)/settings';
import GlobalPlayer from './src/components/GlobalPlayer';

import { TrackPlayerProvider } from './src/context/TrackPlayerContext';
import { ThemeProvider } from './src/context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  Player: { song: any }; // ✅ Full song object
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // 🔥 PHONE AUDIO SESSION - RUNS FIRST
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,        // 🔥 BYPASS SILENT MODE
          staysActiveInBackground: true,     // Background playback
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playThroughEarpieceAndroid: false, // Speaker NOT earpiece
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          shouldDuckAndroid: false,
        });
        console.log('🔊 ✅ PHONE AUDIO SESSION ACTIVE');
      } catch (e) {
        console.error('❌ Audio init failed:', e);
      }
    };
    initAudio();
  }, []);

  return (
    <ThemeProvider>
      <TrackPlayerProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen 
              name="Player" 
              component={PlayerScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </TrackPlayerProvider>
    </ThemeProvider>
  );
}
