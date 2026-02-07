// File: app/(tabs)/favorites.tsx
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function FavoritesScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFDDEE', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#FF6B81"
          name="heart.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Favorites
        </ThemedText>
      </ThemedView>
      <ThemedText>
        This is your favorites screen. Songs you mark as favorite will appear here.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#FF6B81',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
