// File: src/screens/FavoritesScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayerService from '../services/TrackPlayerService';
import { albums } from '../data/musicData';

const FavoritesScreen = () => {
  const [favoriteSongs, setFavoriteSongs] = useState([]);

  // Load favorites from AsyncStorage
  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    if (favs) {
      const favIds = JSON.parse(favs);
      const songs = [];
      // Map favorite IDs to actual song objects
      albums.forEach((album) => {
        album.songs.forEach((song) => {
          if (favIds.includes(song.id)) songs.push(song);
        });
      });
      setFavoriteSongs(songs);
    }
  };

  useEffect(() => {
    const unsubscribe = loadFavorites();
    return () => unsubscribe;
  }, []);

  const playSong = async (song) => {
    // Setup TrackPlayer with the selected song
    await TrackPlayerService.setupPlayer([song], song.id);
  };

  const renderSong = ({ item }) => (
    <TouchableOpacity style={styles.songCard} onPress={() => playSong(item)}>
      <Image source={item.artwork} style={styles.artwork} />
      <View style={styles.songInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favoriteSongs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No favorites yet</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteSongs}
          keyExtractor={(item) => item.id}
          renderItem={renderSong}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // dark mode handled globally
  },
  songCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  artwork: {
    width: 60,
    height: 60,
  },
  songInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  artist: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default FavoritesScreen;
