import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AlbumCard from '../components/AlbumCard';
import SongCard, { Song } from '../components/SongCard';
import PlayerControls from '../components/PlayerControls';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTrackPlayer from '../hooks/useTrackPlayer';
import api from '../plugins/api';
import FavoriteButton from '../components/FavoriteButton';

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

const PRIMARY = '#1DB954';
const TEXT = '#333';
const CARD = '#f9f9f9';

export default function MainScreen({ navigation }: any) {
  const { theme } = useContext(ThemeContext);
  const { playSong, currentSong } = useTrackPlayer();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets(); // ✅ get top notch height

  useEffect(() => {
    async function fetchData() {
      try {
        const localAlbums = await AsyncStorage.getItem('albums');
        const localSongs = await AsyncStorage.getItem('songs');

        if (localAlbums && localSongs) {
          setAlbums(JSON.parse(localAlbums));
          setSongs(JSON.parse(localSongs));
          setLoading(false);
          return;
        }

        const [albumResponse, songResponse] = await Promise.all([
          api.get('/albums'),
          api.get('/songs'),
        ]);

        const normalizedSongs: Song[] = songResponse.data.data.map((song: any) => ({
          id: song.id,
          title: song.title,
          url: song.url,
          duration: song.duration,
          file_size: song.file_size,
        }));

        setAlbums(albumResponse.data.data);
        setSongs(normalizedSongs);

        await AsyncStorage.setItem('albums', JSON.stringify(albumResponse.data.data));
        await AsyncStorage.setItem('songs', JSON.stringify(normalizedSongs));
      } catch (e) {
        console.log('Fetch error:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        size="large"
        color="#1DB954"
      />
    );
  }

  const PLAYER_HEIGHT = currentSong ? 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ✅ Transparent status bar */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Header merged with status bar */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
      </View>

      {/* Content */}
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: PLAYER_HEIGHT + 16 }}>
          <Text style={styles.sectionTitle}>Albums</Text>
          <FlatList
            data={albums}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AlbumCard
                album={item}
                onPress={() => navigation.navigate('AlbumDetails', { albumId: item.id })}
              />
            )}
          />

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Songs</Text>
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <SongCard
                song={item}
                onPress={() => playSong(item)}
                rightAction={
                  <FavoriteButton
                    songId={item.id}
                    theme={{ primary: PRIMARY, text: TEXT, card: CARD }}
                  />
                }
              />
            )}
          />

        </ScrollView>
      </SafeAreaView>

      {currentSong && (
        <View style={styles.playerContainer}>
          <PlayerControls />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1DB954',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
