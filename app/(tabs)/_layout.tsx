import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#fff',       // active icon color (opaque white)
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)', // darker semi-transparent for better contrast on green
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          height: 70,
          backgroundColor: '#1DB954', // primary green
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
          borderRadius: 0, // round edges
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <IconSymbol size={28} name="house.fill" color={color} />
            </View>
          ),
        }}
      />

      {/* Playlists */}
      <Tabs.Screen
        name="playlists"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <IconSymbol size={28} name="music.note.list" color={color} />
            </View>
          ),
        }}
      />

      {/* Favorites - Fixed: Uses consistent stroke-based icons + better inactive color */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <IconSymbol
                size={28}
                name={focused ? 'heart.fill' : 'heart'} // filled active, outline inactive (both visible now)
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <IconSymbol size={28} name="gearshape.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,   // enough space so icon is always visible
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: 'rgba(0,0,0,0.2)', // subtle overlay for focused tab
  },
});
