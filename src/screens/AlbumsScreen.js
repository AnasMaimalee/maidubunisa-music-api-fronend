// File: src/screens/AlbumScreen.js

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { albums } from '../data/musicData';

const AlbumScreen = () => {
  const navigation = useNavigation();

  const renderAlbum = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.albumCard}
        onPress={() => navigation.navigate('SongScreen', { albumId: item.id })}
      >
        <Image source={item.songs[0].artwork} style={styles.albumArt} />
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{item.title}</Text>
          <Text style={styles.albumDate}>{item.releaseDate}</Text>
          <Text style={styles.albumCount}>{item.songs.length} Songs</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={renderAlbum}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // dark mode handled globally
  },
  albumCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1E1E1E', // slightly card background
    borderRadius: 12,
    overflow: 'hidden',
  },
  albumArt: {
    width: 80,
    height: 80,
  },
  albumInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  albumDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  albumCount: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
});

export default AlbumScreen;
