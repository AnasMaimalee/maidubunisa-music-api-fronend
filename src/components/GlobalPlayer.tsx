// src/components/GlobalPlayer.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PlayerControls from './PlayerControls';
import useTrackPlayer from '../hooks/useTrackPlayer';

export default function GlobalPlayer() {
  const { currentSong } = useTrackPlayer();
  if (!currentSong) return null;

  return (
    <View style={styles.container}>
      <PlayerControls />
      <Text style={styles.songTitle} numberOfLines={1}>
        {currentSong.title}
      </Text>
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
    zIndex: 9999,
  },
  songTitle: {
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
});
