import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FavoriteButton from './FavoriteButton';
import { ThemeContext } from '../context/ThemeContext';
import { Colors } from '../styles/global';

// ThemeColors type
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
  const themeKey: 'light' | 'dark' = themeContext?.theme ?? 'light';
  const themeColors: ThemeColors = Colors[themeKey];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        {
          backgroundColor: themeColors.card,
          shadowColor: themeColors.text,
        },
      ]}
    >
      {/* LEFT: artwork placeholder */}
      <View
        style={[
          styles.artwork,
          { backgroundColor: themeColors.primary + '22' },
        ]}
      >
        <MaterialIcons
          name="music-note"
          size={20}
          color={themeColors.primary}
        />
      </View>

      {/* CENTER: title + artist */}
      <View style={styles.textWrapper}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: themeColors.text }]}
        >
          {song.title}
        </Text>

        {song.artist && (
          <Text
            numberOfLines={1}
            style={[styles.artist, { color: themeColors.mutedText }]}
          >
            {song.artist}
          </Text>
        )}
      </View>

      {/* RIGHT: favorite */}
      <FavoriteButton songId={song.id} theme={themeColors} />
    </TouchableOpacity>
  );
};

export default SongCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,

    // shadow / elevation
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  artwork: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textWrapper: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  artist: {
    fontSize: 13,
    marginTop: 2,
  },
});
