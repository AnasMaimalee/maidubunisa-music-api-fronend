import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#fff', // active icon white
        tabBarInactiveTintColor: '#ffffffAA', // inactive icons semi-transparent
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          height: 70,
          backgroundColor: '#1DB954', // full primary background
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 10,
          overflow: 'hidden',
        },
      }}
    >
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
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <IconSymbol size={28} name="music.note.list" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeTab]}>
              <IconSymbol
                size={28}
                name={focused ? 'favorite' : 'favorite-border'}
                color={color}
              />
            </View>
          ),
        }}
      />
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
    padding: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: 'rgba(0,0,0,0.2)', // subtle darker overlay for active
    borderRadius: 10,
    padding: 15,
  },
});
