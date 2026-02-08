import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import SongCard, { Song } from '@/src/components/SongCard';
import FavoriteButton from '../components/FavoriteButton';
import useTrackPlayer from '@/src/hooks/useTrackPlayer';
import { FavoritesContext } from '@/src/context/FavoritesContext';

export default function FavoritesScreen() {
  const { playSong } = useTrackPlayer();
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  const PRIMARY = '#1DB954';
  const BG_LIGHT = '#fff';

  const handleToggleFavorite = (songId: string) => {
    removeFavorite(songId);
  };

  return (
    <ParallaxScrollView
      style={{ backgroundColor: BG_LIGHT }}
      contentContainerStyle={{ padding: 16 }}
      headerBackgroundColor={PRIMARY}
      // Removed large heart icon
      headerImage={<View />}
      headerHeight={80}
    >
      {favorites.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text style={{ color: '#555' }}>No favorite songs yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites.filter((item) => !!item && !!item.id)}
          keyExtractor={(item, index) => item?.id || String(index)}
          renderItem={({ item: song }) => (
            <SongCard
              song={song}
              onPress={() => playSong(song)}
              rightAction={
                <FavoriteButton
                  songId={song.id}
                  onToggle={() => handleToggleFavorite(song.id)}
                  theme={{ primary: PRIMARY, text: '#333', card: '#f9f9f9' }}
                />
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
