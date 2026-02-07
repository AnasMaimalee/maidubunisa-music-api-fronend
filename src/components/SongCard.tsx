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

export interface Song {
  id: string;
  title: string;
  url: string;          // FULL URL REQUIRED
  duration?: number;    // seconds
  file_size?: number;   // bytes
}

interface SongCardProps {
  song: Song;
  onPress: (song: Song) => void;
}

const formatSize = (bytes?: number) => {
  if (!bytes) return '';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const SongCard: React.FC<SongCardProps> = ({ song, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const themeColors = Colors[theme] ?? Colors.dark;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(song)}
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
          style={[styles.title, { color: themeColors.text }]}
        >
          {song.title}
        </Text>

        <View style={styles.metaRow}>
          {/* {song.duration && (
            <Text style={[styles.meta, { color: themeColors.mutedText }]}>
              {formatDuration(song.duration)}
            </Text>
          )} */}

          {song.file_size && (
            <Text style={[styles.meta, { color: themeColors.mutedText }]}>
              {formatSize(song.file_size)}
            </Text>
          )}
        </View>
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
    elevation: 4,
  },

  textWrapper: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
  },

  meta: {
    fontSize: 12,
  },
});
