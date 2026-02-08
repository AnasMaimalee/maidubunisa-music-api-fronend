// app/(tabs)/favorites.tsx - ✅ FULLY FIXED LIVE FAVORITES!
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SongCard, { Song } from '@/src/components/SongCard';
import FavoriteButton from '@/src/components/FavoriteButton';
import useTrackPlayer from '@/src/hooks/useTrackPlayer';

const PRIMARY = '#1DB954';
const TEXT = '#333';
const CARD_BG = '#f9f9f9';

export default function FavoritesScreen() {
  const { playSong, currentSong } = useTrackPlayer();
  
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // ✅ Manual safe area
  const getTopPadding = () => {
    if (Platform.OS === 'ios') return 50;
    return RNStatusBar.currentHeight || 0;
  };

  // ✅ LOAD SONGS ONCE (needed for filtering)
  const loadSongs = useCallback(async () => {
    try {
      const songsRaw = await AsyncStorage.getItem('songs');
      if (songsRaw) {
        const songs: Song[] = JSON.parse(songsRaw);
        setAllSongs(songs);
      }
    } catch (error) {
      console.warn('Failed to load songs:', error);
    }
  }, []);

  // 🔥 LIVE FAVORITES WATCHER - UPDATES EVERY 500ms!
  useEffect(() => {
    let isMounted = true;
    
    const watchFavorites = async () => {
      if (!isMounted) return;
      
      try {
        const savedFavIds = await AsyncStorage.getItem('favoriteIds');
        const ids = savedFavIds ? JSON.parse(savedFavIds) : [];
        
        // ✅ UPDATE favoriteIds state
        setFavoriteIds(ids);
        
        // ✅ FILTER favorites from allSongs INSTANTLY
        if (allSongs.length > 0) {
          const favSongs = allSongs.filter(song => ids.includes(song.id));
          setFavorites(favSongs);
        }
      } catch (error) {
        console.warn('Watch favorites error:', error);
      }
    };

    // 🔥 CHECK EVERY 500ms = INSTANT updates!
    const interval = setInterval(watchFavorites, 500);
    
    // Initial check
    watchFavorites();
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [allSongs]); // Re-watch when songs load

  // Load songs on mount
  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  // Handle remove (triggers watcher automatically)
  const handleRemoveFavorite = useCallback(async (songId: string) => {
    try {
      const newFavIds = favoriteIds.filter(id => id !== songId);
      await AsyncStorage.setItem('favoriteIds', JSON.stringify(newFavIds));
      // Watcher will auto-update!
    } catch (error) {
      console.warn('Remove favorite error:', error);
    }
  }, [favoriteIds]);

  // Show loading until songs are ready
  if (allSongs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  const PLAYER_HEIGHT = currentSong ? 100 : 0;
  const TOP_PADDING = getTopPadding();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />
      
      <View style={[styles.header, { paddingTop: TOP_PADDING }]}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.favCount}>{favorites.length} songs</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={song => song.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: PLAYER_HEIGHT }]}
        renderItem={({ item: song }) => (
          <SongCard
            song={song}
            onPress={() => playSong(song)}
            rightAction={
              <FavoriteButton
                songId={song.id}
                onToggle={() => handleRemoveFavorite(song.id)}
                theme={{ primary: PRIMARY, text: TEXT, card: CARD_BG }}
              />
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No favorite songs yet</Text>
            <Text style={styles.emptySubtext}>Tap ♥️ icon to add songs from home</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {currentSong && (
        <View style={styles.playerContainer}>
          <View style={styles.playerPlaceholder} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 100,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  favCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  listContent: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  playerPlaceholder: {
    height: 80,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
