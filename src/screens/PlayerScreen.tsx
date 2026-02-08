// src/screens/PlayerScreen.tsx - FULL PLAYER + SEEKING
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Slider,
} from 'react-native';
import PlayerControls from '../components/PlayerControls';
import useTrackPlayer from '../hooks/useTrackPlayer';

type Props = { route: { params: { song: any } } };

export default function PlayerScreen({ route }: Props) {
  const { song } = route.params;
  const {
    playSong,
    playbackState,
    currentSong,
    position,
    duration,
    seekTo,
    togglePlayPause,
  } = useTrackPlayer();

  useEffect(() => {
    if (song && playbackState === 'stopped') {
      playSong(song);
    }
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🎼 ARTWORK */}
      <View style={styles.artworkContainer}>
        <View style={styles.artwork}>
          <Text style={styles.artworkText}>🎵</Text>
        </View>
      </View>

      {/* 📝 SONG INFO */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{currentSong?.title || song.title}</Text>
        <Text style={styles.artist}>Artist Name</Text>
      </View>

      {/* ⏱️ SEEK BAR (TARIYA) */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#1DB954"
          onSlidingComplete={(value) => seekTo(value)}  // 🔥 SEEKING!
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      {/* 🎛️ CONTROLS */}
      <View style={styles.controlsContainer}>
        <PlayerControls />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  artworkContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: {
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkText: {
    fontSize: 120,
    color: '#666',
  },
  infoContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  artist: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 4,
  },
  progressContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
});
