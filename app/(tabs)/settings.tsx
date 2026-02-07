// File: app/(tabs)/settings.tsx
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FDEBD0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#FF8C00"
          name="gearshape.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Settings
        </ThemedText>
      </ThemedView>
      <ThemedText>
        This is your settings screen. You can manage app preferences here.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#FF8C00',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
