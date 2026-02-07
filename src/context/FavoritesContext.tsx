// File: src/context/FavoritesContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Song type
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumId?: string;
  duration?: number;
}

// Define the context type
interface FavoritesContextType {
  favorites: Song[];
  addFavorite: (song: Song) => Promise<void>;
  removeFavorite: (songId: string) => Promise<void>;
  isFavorite: (songId: string) => boolean;
}

// Provide default values for context
export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
});

// Provider props
interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Song[]>([]);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem('favorites');
        if (saved) setFavorites(JSON.parse(saved));
      } catch (error) {
        console.log('Failed to load favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const addFavorite = async (song: Song) => {
    const updated = [...favorites, song];
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeFavorite = async (songId: string) => {
    const updated = favorites.filter(s => s.id !== songId);
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const isFavorite = (songId: string) => favorites.some(s => s.id === songId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
