// File: src/screens/PlayerScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Slider, Alert } from 'react-native';
import TrackPlayerService from '../services/TrackPlayerService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlayerScreen({ route, navigation }) {
  // Current song from route params
  const { song, albumSongs } = route.params;

  // State
  const [currentSong, setCurrentSong] = useState(song);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopMode, setLoopMode] = useState('all'); // all | single | shuffle
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayerService.setupPlayer(albumSongs, currentSong.id);
        setPlaying(true);
        const dur = await TrackPlayerService.getDuration();
        setDuration(dur);

        // Load favorites from AsyncStorage
        const favs = await AsyncStorage.getItem('favorites');
        setFavorites(favs ? JSON.parse(favs) : []);
      } catch (err) {
        console.log('Player setup error', err);
      }
    };
    setupPlayer();

    const interval = setInterval(async () => {
      const pos = await TrackPlayerService.getPosition();
      setPosition(pos);
    }, 500);

    return () => clearInterval(interval);
  }, [currentSong]);

  // Toggle play/pause
  const togglePlay = async () => {
    if (playing) {
      await TrackPlayerService.pause();
      setPlaying(false);
    } else {
      await TrackPlayerService.play();
      setPlaying(true);
    }
  };

  // Play next song
  const nextSong = async () => {
    const next = await TrackPlayerService.next(loopMode);
    if (next) setCurrentSong(next);
  };

  // Play previous song
  const prevSong = async () => {
    const prev = await TrackPlayerService.previous(loopMode);
    if (prev) setCurrentSong(prev);
  };

  // Toggle loop mode
  const toggleLoopMode = () => {
    if (loopMode === 'all') setLoopMode('single');
    else if (loopMode === 'single') setLoopMode('shuffle');
    else setLoopMode('all');
    Alert.alert('Loop Mode', loopMode.toUpperCase());
  };

  // Add / remove from favorites
  const toggleFavorite = async () => {
    let updated = [...favorites];
    if (favorites.includes(currentSong.id)) {
      updated = updated.filter((id) => id !== currentSong.id);
    } else {
      updated.push(currentSong.id);
    }
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentSong.title}</Text>
      <Text style={styles.artist}>{currentSong.artist || 'Unknown'}</Text>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={(val) => TrackPlayerService.seekTo(val)}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={prevSong} style={styles.controlButton}>
          <Text style={styles.controlText}>⏮️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.controlButton}>
          <Text style={styles.controlText}>{playing ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={nextSong} style={styles.controlButton}>
          <Text style={styles.controlText}>⏭️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleLoopMode} style={styles.controlButton}>
          <Text style={styles.controlText}>🔁</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFavorite} style={styles.controlButton}>
          <Text style={styles.controlText}>
            {favorites.includes(currentSong.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  artist: { fontSize: 18, color: 'gray', marginBottom: 20 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 20 },
  controlButton: { padding: 12 },
  controlText: { fontSize: 24 },
});
