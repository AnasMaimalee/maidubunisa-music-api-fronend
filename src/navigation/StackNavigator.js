// File: src/navigation/StackNavigator.js

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // <-- FIXED
import SplashScreen from '../screens/SplashScreen';
import MainScreen from '../screens/MainScreen';
import AlbumDetailsScreen from '../screens/AlbumDetailsScreen';
import SongPlayerScreen from '../screens/SongPlayerScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator(); // <-- changed

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false, // Hide header for all screens
      }}
    >
      {/* Splash Screen */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Main App */}
      <Stack.Screen name="Main" component={MainScreen} />

      {/* Other screens */}
      <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
      <Stack.Screen name="SongPlayer" component={SongPlayerScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
