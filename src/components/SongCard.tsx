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

type ThemeColors = typeof Colors.light;

export interface Song {
  id: string;
  title: string;
  artist?: string;
}

interface SongCardProps {
  song: Song;
  onPress: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  const themeContext = useContext(ThemeContext);
  const themeKey: 'light' | 'dark' = themeContext?.theme ?? 'dark';
  const themeColors: ThemeColors = Colors[themeKey];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.container,
        { backgroundColor: themeColors.card },
      ]}
    >
      {/* NETFLIX ACCENT BAR */}
      <View
        style={[
          styles.accent,
          { backgroundColor: themeColors.primary },
        ]}
      />

      {/* ICON */}
      <View style={styles.iconWrap}>
        <MaterialIcons
          name="music-note"
          size={22}
          color={themeColors.primary}
        />
      </View>

      {/* TEXT */}
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

      {/* FAVORITE */}
      <FavoriteButton songId={song.id} theme={themeColors} />
    </TouchableOpacity>
  );
};

export default SongCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,

    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  accent: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textWrapper: {
    flex: 1,
  },

  title: {
    fontSize: 16.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  artist: {
    fontSize: 12.5,
    marginTop: 4,
  },
});
