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
  file_size?: number; // bytes
}

interface SongCardProps {
  song: Song;
  onPress: () => void;
}

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  const themeContext = useContext(ThemeContext);
  const themeKey: 'light' | 'dark' = themeContext?.theme ?? 'dark';
  const themeColors: ThemeColors = Colors[themeKey];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        { backgroundColor: themeColors.card },
      ]}
    >
      {/* ICON */}
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: themeColors.primary },
        ]}
      >
        <MaterialIcons name="music-note" size={22} color="#fff" />
      </View>

      {/* TEXT */}
      <View style={styles.textWrapper}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: themeColors.primary }]}
        >
          {song.title}
        </Text>

        {song.file_size && (
          <Text
            style={[styles.meta, { color: themeColors.mutedText }]}
          >
            {formatSize(song.file_size)}
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
    paddingVertical: 14,
    paddingHorizontal: 16,

    // flat list
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffffff12',
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,

    elevation: 5,
  },

  textWrapper: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  meta: {
    fontSize: 12,
    marginTop: 4,
  },
});
