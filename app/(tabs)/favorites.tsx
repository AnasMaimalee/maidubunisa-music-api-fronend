import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SongCard, { Song } from '@/src/components/SongCard';
import FavoriteButton from '@/src/components/FavoriteButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteService from '@/src/services/FavoriteService';
import useTrackPlayer from '@/src/hooks/useTrackPlayer';
import PlayerControls from '@/src/components/PlayerControls';

const PRIMARY = '#1DB954';
const TEXT = '#333';
const CARD = '#f9f9f9';

export default function FavoritesScreen() {
  const { playSong, currentSong } = useTrackPlayer();
  const insets = useSafeAreaInsets();

  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites initially
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favIds = await FavoriteService.getFavorites();
      const allSongsRaw = await AsyncStorage.getItem('songs');
      const allSongs: Song[] = allSongsRaw ? JSON.parse(allSongsRaw) : [];
      const favSongs = allSongs.filter(song => favIds.includes(song.id));
      setFavorites(favSongs);
    } catch (e) {
      console.log('Failed to load favorites:', e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    loadFavorites();
  }, []);

  // Remove from favorites immediately when clicked
  const handleRemoveFavorite = async (songId: string) => {
    try {
      // Remove from FavoriteService (updates AsyncStorage)
      await FavoriteService.removeFavorite(songId);

      // Remove from local state immediately
      setFavorites(prev => prev.filter(song => song.id !== songId));
    } catch (e) {
      console.log('Failed to remove favorite:', e);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={PRIMARY} />;
  }

  const PLAYER_HEIGHT = currentSong ? 100 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={favorites}
          keyExtractor={(song) => song.id}
          contentContainerStyle={{ padding: 16, paddingBottom: PLAYER_HEIGHT + 16 }}
          renderItem={({ item: song }) => (
            <SongCard
              song={song}
              onPress={() => playSong(song)}
              rightAction={
                <FavoriteButton
                  songId={song.id}
                  onToggle={() => handleRemoveFavorite(song.id)}
                  theme={{ primary: PRIMARY, text: TEXT, card: CARD }}
                />
              }
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: '#555' }}>No favorite songs yet.</Text>
            </View>
          )}
        />
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
    backgroundColor: PRIMARY,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
