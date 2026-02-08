// components/FavoriteButton.tsx - ✅ LIVE WATCHER FIXED!
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteButtonProps {
  songId: string;
  theme?: { primary: string; text: string; card: string };
  onToggle?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ songId, theme, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 🔥 LIVE WATCHER - EVERY Heart button updates instantly!
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        const savedFavIds = await AsyncStorage.getItem('favoriteIds');
        const favIds = savedFavIds ? JSON.parse(savedFavIds) : [];
        setIsFavorite(favIds.includes(songId));
      } catch (error) {
        console.warn('Heart check failed:', error);
      }
    };

    // Check every 300ms = INSTANT feel
    interval = setInterval(checkStatus, 300);
    checkStatus(); // Initial check
    
    return () => clearInterval(interval);
  }, [songId]);

  const animate = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  const toggleFavorite = async () => {
    try {
      const savedFavIds = await AsyncStorage.getItem('favoriteIds');
      const favIds = savedFavIds ? JSON.parse(savedFavIds) : [];
      
      let newFavIds: string[];
      if (favIds.includes(songId)) {
        newFavIds = favIds.filter(id => id !== songId);
      } else {
        newFavIds = [...favIds, songId];
        animate();
      }
      
      // GLOBAL UPDATE - All screens see it!
      await AsyncStorage.setItem('favoriteIds', JSON.stringify(newFavIds));
      
      if (onToggle) onToggle();
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={toggleFavorite}
      style={[
        styles.container,
        { backgroundColor: isFavorite ? `${theme?.primary || '#1DB954'}33` : '#fff' },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorite ? (theme?.primary || '#1DB954') : (theme?.text || '#666')}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
});

export default FavoriteButton;
