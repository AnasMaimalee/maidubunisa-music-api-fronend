import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import SongCard, { Song } from '@/src/components/SongCard';
import FavoriteButton from '@/components/FavoriteButton';
import useTrackPlayer from '@/src/hooks/useTrackPlayer';
import FavoriteService from '@/src/services/FavoriteService';

export default function FavoritesScreen() {
  const { playSong } = useTrackPlayer();
  const [favorites, setFavorites] = useState<Song[]>([]);

  const PRIMARY = '#1DB954';
  const BG_LIGHT = '#fff';

  // Load favorites
  const loadFavorites = async () => {
    const favs = await FavoriteService.getFavorites();
    // ✅ filter out null/undefined items
    setFavorites(favs.filter((item): item is Song => !!item && !!item.id));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggleFavorite = async (songId: string) => {
    await FavoriteService.toggleFavorite(songId);
    loadFavorites();
  };

  return (
    <ParallaxScrollView
      style={{ backgroundColor: BG_LIGHT }}
      contentContainerStyle={{ padding: 16 }}
      headerBackgroundColor={PRIMARY + '33'}
      headerImage={
        <View style={{ position: 'absolute', bottom: -90, left: -35 }} />
      }
    >
      <FlatList
        data={favorites.filter((item) => !!item && !!item.id)} // ✅ filter again
        keyExtractor={(item, index) => item?.id || String(index)} // ✅ fallback key
        renderItem={({ item: song }) => (
          <SongCard song={song} onPress={() => playSong(song)}>
            <FavoriteButton
              songId={song.id}
              onToggle={() => handleToggleFavorite(song.id)}
            />
          </SongCard>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
