// File: src/screens/AlbumDetails.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import TrackPlayer from '../hooks/useTrackPlayer'; // using your custom hook
import { FavoritesContext } from '../context/FavoritesContext';
import { ThemeContext } from '../context/ThemeContext';
import SongCard, { Song } from '../components/SongCard';
import { ThemeColors } from '../styles/global';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Navigation params
type RootStackParamList = {
  AlbumDetails: { album: Album };
};

type Props = NativeStackScreenProps<RootStackParamList, 'AlbumDetails'>;

// Album type
export interface Album {
  id: string;
  title: string;
  cover_url: string;
  release_date?: string;
  songs?: Song[];
}

const AlbumDetails: React.FC<Props> = ({ route, navigation }) => {
  const { album } = route.params;
  const themeContext = useContext(ThemeContext);
  const themeColors: ThemeColors = themeContext?.theme || {
    background: '#fff',
    primary: '#1DB954',
    secondary: '#121212',
    text: '#121212',
    card: '#F2F2F2',
    accent: '#FF6B6B',
  };

  const favoritesContext = useContext(FavoritesContext);
  const addFavorite = favoritesContext?.addFavorite;
  const removeFavorite = favoritesContext?.removeFavorite;
  const isFavorite = favoritesContext?.isFavorite;

  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    setSongs(album.songs || []);
    navigation.setOptions({ title: album.title });
  }, [album]);

  const playSong = async (song: Song) => {
    await TrackPlayer.reset();
    await TrackPlayer.add([
      {
        id: song.id,
        url: song.filePath || '', // replace with your file path property
        title: song.title,
        artist: song.artist || 'Unknown Artist',
        artwork: album.cover_url,
      },
    ]);
    await TrackPlayer.play();
  };

  const toggleFavorite = (song: Song) => {
    if (!addFavorite || !removeFavorite || !isFavorite) return;
    isFavorite(song.id) ? removeFavorite(song.id) : addFavorite(song);
  };

  const renderSong = ({ item }: { item: Song }) => (
    <SongCard
      song={item}
      onPress={() => playSong(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.albumHeader}>
        <Image source={{ uri: album.cover_url }} style={styles.albumImage} />
        <Text style={[styles.albumTitle, { color: themeColors.text }]}>{album.title}</Text>
        <Text style={[styles.albumDate, { color: themeColors.text }]}>{album.release_date}</Text>
      </View>

      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={renderSong}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AlbumDetails;

const styles = StyleSheet.create({
  container: { flex: 1 },
  albumHeader: { alignItems: 'center', paddingVertical: 16 },
  albumImage: { width: 200, height: 200, borderRadius: 12, marginBottom: 12 },
  albumTitle: { fontSize: 22, fontWeight: 'bold' },
  albumDate: { fontSize: 14, marginTop: 4 },
});
