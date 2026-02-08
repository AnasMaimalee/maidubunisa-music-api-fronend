// MainScreen.tsx - NO ERRORS + PAUSE ICON START
import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlbumCard from '../components/AlbumCard';
import SongCard, { Song } from '../components/SongCard';
import PlayerControls from '../components/PlayerControls';
import { ThemeContext } from '../context/ThemeContext';
import useTrackPlayer from '../hooks/useTrackPlayer';
import FavoriteButton from '../components/FavoriteButton';
import api from '../plugins/api';

interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
}

const PRIMARY = '#1DB954';
const TEXT = '#333';
const CARD = '#f9f9f9';

export default function MainScreen() {
  const navigation = useNavigation();
  const { 
    playSong, 
    currentSong,
    playbackState 
  } = useTrackPlayer();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getTopPadding = () => {
    if (Platform.OS === 'ios') return 50;
    return RNStatusBar.currentHeight || 0;
  };

  const syncFavoritesLive = useCallback(async () => {
    try {
      const savedFavIds = await AsyncStorage.getItem('favoriteIds');
      const ids = savedFavIds ? JSON.parse(savedFavIds) : [];
      setFavoriteIds(ids);
    } catch (error) {
      console.warn('Live sync error:', error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(syncFavoritesLive, 300);
    syncFavoritesLive();
    return () => clearInterval(interval);
  }, [syncFavoritesLive]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const localAlbums = await AsyncStorage.getItem('albums');
        const localSongs = await AsyncStorage.getItem('songs');

        if (localAlbums && localSongs) {
          setAlbums(JSON.parse(localAlbums));
          setSongs(JSON.parse(localSongs));
        } else {
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
        }
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  const TOP_PADDING = getTopPadding();
  const TOTAL_SONGS = songs.length;
  const PLAYER_HEIGHT = currentSong ? 140 : 0;

  // 🔥 FIXED - INSIDE COMPONENT
  const handleSongPress = (song: Song, index: number) => {
    console.log('🎵 Song clicked:', song.title);
    playSong(song, songs, index);  // ✅ WORKS
    navigation.navigate('Player', { song });  // ✅ NOW WORKS
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      
      <View style={[styles.header, { paddingTop: TOP_PADDING }]}>
        <Text style={styles.headerWelcome}>Good Morning</Text>
        <Text style={styles.headerTitle}>Playlists</Text>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: PLAYER_HEIGHT }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Albums</Text>
        <FlatList
          data={albums}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AlbumCard album={item} />}
          style={styles.albumList}
        />

        <Text style={[styles.sectionTitle, styles.sectionMarginTop]}>
          All Songs ({TOTAL_SONGS})
        </Text>
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <SongCard
              song={item}
              onPress={() => handleSongPress(item, index)}  // ✅ FIXED
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

      {currentSong && (
        <View style={styles.playerContainer}>
          <PlayerControls />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: PRIMARY,
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerWelcome: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  sectionMarginTop: {
    marginTop: 32,
  },
  albumList: {
    marginBottom: 8,
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
});
