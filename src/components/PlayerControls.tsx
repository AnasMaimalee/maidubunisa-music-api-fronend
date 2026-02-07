import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../styles/global';
import useTrackPlayer from '../hooks/useTrackPlayer';

const PlayerControls: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme] ?? Colors.dark;

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
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { backgroundColor: themeColors.card },
        ]}
      >
        {/* Shuffle */}
        <TouchableOpacity
          onPress={toggleShuffle}
          style={[
            styles.sideButton,
            isShuffling && styles.activeGlow,
          ]}
        >
          <Icon
            name="shuffle"
            size={22}
            color={isShuffling ? themeColors.primary : themeColors.text}
          />
        </TouchableOpacity>

        {/* Previous */}
        <TouchableOpacity onPress={skipToPrevious}>
          <Icon name="skip-previous" size={36} color={themeColors.text} />
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          onPress={togglePlayPause}
          style={[
            styles.playButton,
            { backgroundColor: themeColors.primary },
          ]}
        >
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={42}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={skipToNext}>
          <Icon name="skip-next" size={36} color={themeColors.text} />
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          onPress={toggleLoop}
          style={[
            styles.sideButton,
            isLooping && styles.activeGlow,
          ]}
        >
          <Icon
            name="repeat"
            size={22}
            color={isLooping ? themeColors.primary : themeColors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerControls;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 36,
    paddingVertical: 18,
    paddingHorizontal: 22,

    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },

  playButton: {
    width: 46,
    height: 46,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },

  sideButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeGlow: {
    backgroundColor: '#ffffff18',
    transform: [{ scale: 1.15 }],
  },
});
