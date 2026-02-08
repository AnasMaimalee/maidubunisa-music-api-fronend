import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import useTrackPlayer from '@/src/hooks/useTrackPlayer';
import FavoriteService from '@/src/services/FavoriteService';
import SongCard, { Song } from '@/src/components/SongCard';
import FavoriteButton from '@/src/components/FavoriteButton';
import { Fonts } from '@/src/styles/global';

export default function FavoritesScreen() {
  const { playSong } = useTrackPlayer();
  const [favorites, setFavorites] = useState<Song[]>([]);

  const PRIMARY = '#1DB954';
  const BG_LIGHT = '#fff';

  // Load favorites
  const loadFavorites = async () => {
    const favs = await FavoriteService.getFavorites();
    setFavorites(favs.filter((s): s is Song => !!s && !!s.id));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Remove from favorites immediately
  const handleRemoveFavorite = async (songId: string) => {
    await FavoriteService.toggleFavorite(songId);
    setFavorites(prev => prev.filter(song => song.id !== songId));
  };

  return (
    <ParallaxScrollView
      style={{ backgroundColor: BG_LIGHT }}
      contentContainerStyle={{ padding: 16 }}
      headerBackgroundColor={PRIMARY + '33'}
      headerImage={
        <IconSymbol
          size={310}
          color={PRIMARY}
          name="heart.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded, color: PRIMARY }}
        >
          Favorites
        </ThemedText>
      </ThemedView>

      <FlatList
        data={favorites}
        keyExtractor={(song, index) => song.id || String(index)}
        renderItem={({ item: song }) => (
          <SongCard
            song={song}
            onPress={() => playSong(song)}
            rightAction={
              <FavoriteButton
                songId={song.id}
                onToggle={() => handleRemoveFavorite(song.id)}
              />
            }
          />
        )}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: { bottom: -90, left: -35, position: 'absolute' },
  titleContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
});
