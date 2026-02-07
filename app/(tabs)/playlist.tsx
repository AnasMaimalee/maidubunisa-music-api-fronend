// File: app/(tabs)/playlist.tsx
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function PlaylistScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0F0FD', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#1E90FF"
          name="music.note.list"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Playlist
        </ThemedText>
      </ThemedView>
      <ThemedText>
        This is your playlist screen. You can create and manage your playlists here.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#1E90FF',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
