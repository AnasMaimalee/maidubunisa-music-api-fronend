// File: src/components/FavoriteButton.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FavoriteService from '../services/FavoriteService';
import { Colors, ThemeColors } from '../styles/global';

interface FavoriteButtonProps {
  songId: string;
  theme?: ThemeColors; // optional theme prop
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ songId, theme }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await FavoriteService.isFavorite(songId);
      setIsFavorite(fav);
    };
    checkFavorite();
  }, [songId]);

  const toggleFavorite = async () => {
    const newStatus = await FavoriteService.toggleFavorite(songId);
    setIsFavorite(newStatus);
  };

  const themeColors = theme || Colors.light;

  return (
    <TouchableOpacity onPress={toggleFavorite} style={styles.button}>
      <MaterialIcons
        name={isFavorite ? 'favorite' : 'favorite-border'}
        size={28}
        color={isFavorite ? themeColors.accent : themeColors.text}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
