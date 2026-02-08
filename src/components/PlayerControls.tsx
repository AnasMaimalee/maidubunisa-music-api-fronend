import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Text,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors } from '../styles/global';
import useTrackPlayer from '../hooks/useTrackPlayer';

const PlayerControls: React.FC = () => {
  const themeColors = Colors; // LIGHT MODE ONLY

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

  // Play button animation
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressPlay = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();

    togglePlayPause();
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: themeColors.card }]}>
        {/* SHUFFLE */}
        <TouchableOpacity onPress={toggleShuffle} style={styles.iconButton}>
          <Icon
            name="shuffle"
            size={24}
            color={isShuffling ? themeColors.primary : themeColors.text}
          />
        </TouchableOpacity>

        {/* PREVIOUS */}
        <TouchableOpacity onPress={skipToPrevious} style={styles.iconButton}>
          <Icon name="skip-previous" size={34} color={themeColors.text} />
        </TouchableOpacity>

        {/* PLAY */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            onPress={handlePressPlay}
            style={[styles.playButton, { backgroundColor: themeColors.primary }]}
          >
            <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={36} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* NEXT */}
        <TouchableOpacity onPress={skipToNext} style={styles.iconButton}>
          <Icon name="skip-next" size={34} color={themeColors.text} />
        </TouchableOpacity>

        {/* REPEAT */}
        <TouchableOpacity onPress={toggleLoop} style={styles.iconButton}>
          <Icon
            name="repeat"
            size={24}
            color={isLooping ? themeColors.primary : themeColors.text}
          />
          {isLooping && (
            <View style={[styles.loopBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={styles.loopText}>1</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerControls;

const styles = StyleSheet.create({
  wrapper: { padding: 16 },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 14,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  loopBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loopText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});
