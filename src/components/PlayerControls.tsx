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
    <View style={[styles.wrapper]}>
      <View style={[styles.container, { backgroundColor: themeColors.card }]}>
        
        {/* Shuffle */}
        <TouchableOpacity
          onPress={toggleShuffle}
          style={[
            styles.smallButton,
            isShuffling && {
              backgroundColor: themeColors.primary + '22',
              transform: [{ scale: 1.1 }],
            },
          ]}
        >
          <Icon
            name="shuffle"
            size={24}
            color={isShuffling ? themeColors.primary : themeColors.text}
          />
        </TouchableOpacity>

        {/* Previous */}
        <TouchableOpacity onPress={skipToPrevious}>
          <Icon name="skip-previous" size={34} color={themeColors.text} />
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
            size={36}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={skipToNext}>
          <Icon name="skip-next" size={34} color={themeColors.text} />
        </TouchableOpacity>

        {/* Repeat */}
        <TouchableOpacity
          onPress={toggleLoop}
          style={[
            styles.smallButton,
            isLooping && {
              backgroundColor: themeColors.primary + '22',
              transform: [{ scale: 1.1 }],
            },
          ]}
        >
          <Icon
            name="repeat"
            size={24}
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
    padding: 16,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 30,

    // elevation / shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },

  smallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
