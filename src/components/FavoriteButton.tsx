import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FavoriteService from '../services/FavoriteService';

interface FavoriteButtonProps {
  songId: string;
  theme?: { primary: string; text: string; accent: string; card: string };
  onToggle?: () => void; // called after toggle
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ songId, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Load initial favorite status
  useEffect(() => {
    const checkFavorite = async () => {
      const fav = await FavoriteService.isFavorite(songId);
      setIsFavorite(fav);
    };
    checkFavorite();
  }, [songId]);

  // Animation when favorited
  const animate = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const toggleFavorite = async () => {
    try {
      const newStatus = await FavoriteService.toggleFavorite(songId);
      setIsFavorite(newStatus);

      if (newStatus) animate(); // animate only when added

      if (onToggle) onToggle(); // refresh parent immediately
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
    }
  };

  const ACTIVE_COLOR = '#1DB954';
  const INACTIVE_COLOR = '#333';
  const ACTIVE_BG = '#1DB95433';
  const INACTIVE_BG = '#fff';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={toggleFavorite}
      style={[
        styles.container,
        { backgroundColor: isFavorite ? ACTIVE_BG : INACTIVE_BG },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={26}
          color={isFavorite ? ACTIVE_COLOR : INACTIVE_COLOR}
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
