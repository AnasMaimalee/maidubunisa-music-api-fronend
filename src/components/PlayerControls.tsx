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
        {/* SHUFFLE */}
        <TouchableOpacity onPress={toggleShuffle}>
          <Icon
            name="shuffle"
            size={24}
            color={isShuffling ? themeColors.primary : themeColors.text}
          />
        </TouchableOpacity>

        {/* PREVIOUS */}
        <TouchableOpacity onPress={skipToPrevious}>
          <Icon name="skip-previous" size={34} color={themeColors.text} />
        </TouchableOpacity>

        {/* PLAY */}
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

        {/* NEXT */}
        <TouchableOpacity onPress={skipToNext}>
          <Icon name="skip-next" size={34} color={themeColors.text} />
        </TouchableOpacity>

        {/* REPEAT */}
        <TouchableOpacity onPress={toggleLoop}>
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
    paddingHorizontal: 20,
    borderRadius: 30,

    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 12,
  },
});
