// src/components/GlobalPlayer.tsx - APPEARS ON ALL SCREENS
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PlayerControls from './PlayerControls';
import useTrackPlayer from '../hooks/useTrackPlayer';

export default function GlobalPlayer() {
  const { currentSong } = useTrackPlayer();

  // Only show when song playing
  if (!currentSong) return null;

  return (
    <View style={styles.container}>
      <PlayerControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 30,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000, // Always on top
  },
});
