// File: src/context/FavoritesContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '@/src/components/SongCard';

interface FavoritesContextType {
  favorites: Song[];
  addFavorite: (song: Song) => void;
  removeFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Song[]>([]);

  // Load favorites on mount
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('favorites');
      if (stored) setFavorites(JSON.parse(stored));
    };
    load();
  }, []);

  const saveFavorites = async (newFavs: Song[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const addFavorite = (song: Song) => {
    if (!favorites.some(f => f.id === song.id)) {
      saveFavorites([...favorites, song]);
    }
  };

  const removeFavorite = (songId: string) => {
    saveFavorites(favorites.filter(f => f.id !== songId));
  };

  const isFavorite = (songId: string) => favorites.some(f => f.id === songId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
