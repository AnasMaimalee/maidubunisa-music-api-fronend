// File: src/services/FavoriteService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

const FavoriteService = {
  // Get all favorite song IDs
  getFavorites: async (): Promise<string[]> => {
    try {
      const favs = await AsyncStorage.getItem(FAVORITES_KEY);
      return favs ? JSON.parse(favs) : [];
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  },

  // Check if a song is in favorites
  isFavorite: async (songId: string): Promise<boolean> => {
    const favs = await FavoriteService.getFavorites();
    return favs.includes(songId);
  },

  // Add a song to favorites
  addFavorite: async (songId: string): Promise<void> => {
    try {
      const favs = await FavoriteService.getFavorites();
      if (!favs.includes(songId)) {
        favs.push(songId);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  },

  // Remove a song from favorites
  removeFavorite: async (songId: string): Promise<void> => {
    try {
      let favs = await FavoriteService.getFavorites();
      favs = favs.filter((id) => id !== songId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },

  // Toggle favorite (add if not exists, remove if exists)
  toggleFavorite: async (songId: string): Promise<boolean> => {
    const isFav = await FavoriteService.isFavorite(songId);
    if (isFav) {
      await FavoriteService.removeFavorite(songId);
      return false;
    } else {
      await FavoriteService.addFavorite(songId);
      return true;
    }
  },
};

export default FavoriteService;
