// File: src/screens/MainScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import AlbumCard from '../components/AlbumCard';
import SongCard from '../components/SongCard';
import PlayerControls from '../components/PlayerControls';
import { ThemeContext } from '../context/ThemeContext';
import colors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTrackPlayer from '../hooks/useTrackPlayer';
import api from '../plugins/api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Types
interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  duration: number;
}

type RootStackParamList = {
  Main: undefined;
  AlbumDetails: { albumId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export default function MainScreen({ navigation }: Props) {
  const { theme } = useContext(ThemeContext);
  const { playSong } = useTrackPlayer(); // ✅ INSIDE component

  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const localAlbums = await AsyncStorage.getItem('albums');
        const localSongs = await AsyncStorage.getItem('songs');

        if (localAlbums && localSongs) {
          setAlbums(JSON.parse(localAlbums));
          setSongs(JSON.parse(localSongs));
          return;
        }

        const albumResponse = await api.get('/albums');
        const songResponse = await api.get('/songs');

        setAlbums(albumResponse.data.data);
        setSongs(songResponse.data.data);

        await AsyncStorage.setItem('albums', JSON.stringify(albumResponse.data.data));
        await AsyncStorage.setItem('songs', JSON.stringify(songResponse.data.data));
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={[styles.container, { backgroundColor: colors[theme].background }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.heading, { color: colors[theme].text }]}>Albums</Text>

        <FlatList
          data={albums}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlbumCard
              album={item}
              onPress={() => navigation.navigate('AlbumDetails', { albumId: item.id })}
            />
          )}
        />

        <Text style={[styles.heading, { color: colors[theme].text }]}>Songs</Text>

        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={() => playSong(item)} // ✅ WORKS
            />
          )}
        />
      </ScrollView>

      <PlayerControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
