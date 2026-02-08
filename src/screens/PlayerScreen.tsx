// src/screens/PlayerScreen.tsx - COMPLETE NO OVERLAP
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
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
    isLoading,
  } = useTrackPlayer();

  useEffect(() => {
    if (song && playbackState === 'stopped') {
      playSong(song);
    }
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading song...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🎼 TOP CONTENT - FLEXIBLE */}
      <View style={styles.topContent}>
        <View style={styles.artworkContainer}>
          <View style={styles.artwork}>
            <Text style={styles.artworkText}>
              {currentSong?.title?.[0]?.toUpperCase() || '🎵'}
            </Text>
          </View>
        </View>

        <View style={styles.songInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong?.title || song.title || 'Unknown Song'}
          </Text>
          <Text style={styles.artist}>Artist Name</Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {Math.floor(position / 60000)}:
            {Math.floor((position % 60000) / 1000).toString().padStart(2, '0')}
          </Text>
          <Text style={styles.timeText}>
            {Math.floor(duration / 60000)}:
            {Math.floor((duration % 60000) / 1000).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      {/* 🎛️ BOTTOM CONTROLS - FIXED NO OVERLAP */}
      <View style={styles.bottomControls}>
        <PlayerControls />
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {playbackState.charAt(0).toUpperCase() + playbackState.slice(1)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  topContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  artworkText: {
    color: '#666',
    fontSize: 100,
    fontWeight: 'bold',
  },
  songInfo: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  artist: {
    color: '#aaa',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    width: '100%',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // 🔥 NO OVERLAP - PERFECT BOTTOM
  bottomControls: {
    flexShrink: 0, // Don't compress
    paddingHorizontal: 20,
    paddingBottom: 40, // Safe area for iPhone
    paddingTop: 20,
  },
  statusContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  statusText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
});
