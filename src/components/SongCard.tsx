import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FavoriteButton from './FavoriteButton';
import { Colors } from '../styles/global';

export interface Song {
  id: string;
  title: string;
  url: string;
  duration?: number;
  file_path?: string;
  file_size?: number;
}

interface SongCardProps {
  song: Song;
  onPress: (song: Song) => void;
  showFavorite?: boolean; // <-- new: show favorite button
  rightAction?: React.ReactNode; // <-- optional custom right action
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

const SongCard: React.FC<SongCardProps> = ({ song, onPress, showFavorite, rightAction }) => {
  const themeColors = Colors; // LIGHT MODE

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(song)}
      style={[styles.container, { backgroundColor: themeColors.card }]}
    >
      {/* ICON */}
      <View style={[styles.iconWrap, { backgroundColor: themeColors.primary }]}>
        <MaterialIcons name="music-note" size={22} color="#fff" />
      </View>

      {/* TEXT */}
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>
          {song.title}
        </Text>

        <View style={styles.metaRow}>
          {song.file_size && (
            <Text style={[styles.meta, { color: themeColors.text + '99' }]}>
              {formatSize(song.file_size)}
            </Text>
          )}
          {song.duration && (
            <Text style={[styles.meta, { color: themeColors.text + '99', marginLeft: 8 }]}>
              {formatDuration(song.duration)}
            </Text>
          )}
        </View>
      </View>

      {/* RIGHT ACTION */}
      <View style={styles.rightAction}>
        {rightAction}
        {showFavorite && !rightAction && (
          <FavoriteButton songId={song.id} theme={themeColors} />
        )}
      </View>
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
    borderBottomColor: '#00000012',
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
  textWrapper: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  metaRow: { flexDirection: 'row', marginTop: 4 },
  meta: { fontSize: 12 },
  rightAction: { marginLeft: 12, flexDirection: 'row', alignItems: 'center' },
});
