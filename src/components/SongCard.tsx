import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FavoriteButton from './FavoriteButton';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../styles/global';

// ✅ derive ThemeColors type from JS object
type ThemeColors = typeof Colors.light;

// Song type
export interface Song {
  id: string;
  title: string;
  artist?: string;
  albumId?: string;
  duration?: number;
}

interface SongCardProps {
  song: Song;
  onPress: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  const themeContext = useContext(ThemeContext);

  // fallback if ThemeContext is undefined
  const themeKey: 'light' | 'dark' = themeContext?.theme ?? 'light';
  const themeColors: ThemeColors = Colors[themeKey]; // ✅ NO RED UNDERLINE

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {song.title}
        </Text>
      </TouchableOpacity>

      <FavoriteButton songId={song.id} theme={themeColors} />
    </View>
  );
};

export default SongCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
