import React, { useEffect, useState, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FavoriteService from '../services/FavoriteService';
import { Colors, ThemeColors } from '../styles/global';

interface FavoriteButtonProps {
  songId: string;
  theme?: ThemeColors;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ songId, theme }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const themeColors = theme || Colors.light;

  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await FavoriteService.isFavorite(songId);
      setIsFavorite(fav);
    };
    checkFavorite();
  }, [songId]);

  const animate = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleFavorite = async () => {
    const newStatus = await FavoriteService.toggleFavorite(songId);
    setIsFavorite(newStatus);

    if (newStatus) {
      animate();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={toggleFavorite}
      style={[
        styles.container,
        {
          backgroundColor: isFavorite
            ? themeColors.accent + '20'
            : themeColors.card,
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={26}
          color={isFavorite ? themeColors.accent : themeColors.text}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default FavoriteButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: Platform.OS === 'android' ? 3 : 0,
  },
});
