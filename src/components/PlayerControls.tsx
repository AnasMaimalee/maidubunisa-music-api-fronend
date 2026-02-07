// File: src/components/PlayerControls.tsx
import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../styles/global';
import useTrackPlayer from '../hooks/useTrackPlayer';

const PlayerControls: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme] ?? Colors.light;

  const {
    playbackState,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    toggleLoop,
    toggleShuffle,
    isLooping,
    isShuffling,
  } = useTrackPlayer();

  const isPlaying = playbackState === 'playing';

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <TouchableOpacity onPress={skipToPrevious}>
        <Icon name="skip-previous" size={36} color={themeColors.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={togglePlayPause}>
        <Icon
          name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
          size={60}
          color={themeColors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={skipToNext}>
        <Icon name="skip-next" size={36} color={themeColors.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleLoop}>
        <Icon
          name="loop"
          size={28}
          color={isLooping ? themeColors.accent : themeColors.text}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleShuffle}>
        <Icon
          name="shuffle"
          size={28}
          color={isShuffling ? themeColors.accent : themeColors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerControls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});
