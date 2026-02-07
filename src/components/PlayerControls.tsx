// File: src/components/PlayerControl.jsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors } from '../styles/global';

// Mock TrackPlayer for Expo testing
const TrackPlayer = {
  getState: async () => 'playing',
  play: () => console.log('play'),
  pause: () => console.log('pause'),
  skipToNext: async () => console.log('next'),
  skipToPrevious: async () => console.log('previous'),
  setRepeatMode: (mode) => console.log('repeat mode', mode),
  REPEAT_TRACK: 'repeat-track',
  REPEAT_OFF: 'repeat-off',
};

const State = {
  Playing: 'playing',
  Paused: 'paused',
};

const usePlaybackState = () => {
  const [state, setState] = useState(State.Paused);
  return state;
};

const PlayerControl = ({ theme }) => {
  const playbackState = usePlaybackState();
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const themeColors = theme || Colors.light;

  const togglePlayPause = async () => {
    const currentState = await TrackPlayer.getState();
    if (currentState === State.Playing) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const playNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.log('No next track');
    }
  };

  const playPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (e) {
      console.log('No previous track');
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    TrackPlayer.setRepeatMode(!isLooping ? TrackPlayer.REPEAT_TRACK : TrackPlayer.REPEAT_OFF);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
    console.log('shuffle toggled');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <TouchableOpacity onPress={playPrevious}>
        <Icon name="skip-previous" size={36} color={themeColors.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={togglePlayPause} style={styles.playPause}>
        <Icon
          name={playbackState === State.Playing ? 'pause-circle-filled' : 'play-circle-filled'}
          size={60}
          color={themeColors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={playNext}>
        <Icon name="skip-next" size={36} color={themeColors.primary} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleLoop} style={styles.loopButton}>
        <Icon name="loop" size={28} color={isLooping ? themeColors.accent : themeColors.text} />
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleShuffle} style={styles.shuffleButton}>
        <Icon name="shuffle" size={28} color={isShuffling ? themeColors.accent : themeColors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default PlayerControl;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  playPause: {
    marginHorizontal: 12,
  },
  loopButton: {
    marginLeft: 8,
  },
  shuffleButton: {
    marginLeft: 8,
  },
});
