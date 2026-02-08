// PlaylistScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  StatusBar,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import useTrackPlayer from '@/src/hooks/useTrackPlayer';
import SongCard, { Song } from '@/src/components/SongCard';
import api from '@/src/plugins/api';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

const PRIMARY = '#1DB954';
const TEXT = '#333';
const BG = '#fff';
const CARD = '#f9f9f9';
const ICON_BG = '#f0f0f0';

function SongSelectableRow({
  song,
  selected,
  onToggle,
}: {
  song: Song;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const scaleAnim = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePress = () => {
    onToggle(song.id);
    if (!selected) {
      scaleAnim.value = withSpring(1.3, { damping: 5, stiffness: 180 }, () => {
        scaleAnim.value = withSpring(1);
      });
    }
  };

  return (
    <TouchableOpacity style={styles.songRow} onPress={handlePress}>
      <Text style={{ flex: 1 }}>{song.title}</Text>
      <Animated.View
        style={[
          styles.addSongCircle,
          animatedStyle,
          {
            backgroundColor: selected ? PRIMARY : 'transparent',
            borderWidth: 1,
            borderColor: PRIMARY,
          },
        ]}
      >
        {selected && <IconSymbol name="check" size={12} color="#fff" />}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function PlaylistScreen() {
  const { playSong } = useTrackPlayer();
  const insets = useSafeAreaInsets();

  const [playlists, setPlaylists] = useState<{ name: string; songs: Song[] }[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{ name: string; songs: Song[] } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'newPlaylist' | 'playlistDetails' | 'addSongs' | null>(null);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());

  const PLAYLISTS_KEY = '@app_playlists';

  // Load playlists
  const loadPlaylists = async () => {
    const data = await AsyncStorage.getItem(PLAYLISTS_KEY);
    const stored: { [name: string]: Song[] } = data ? JSON.parse(data) : {};
    const formatted = Object.keys(stored).map((name) => ({ name, songs: stored[name] }));
    setPlaylists(formatted);
  };

  const savePlaylists = async (allPlaylists: { [name: string]: Song[] }) => {
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(allPlaylists));
    await loadPlaylists();
  };

  // Load all songs
  const loadAllSongs = async () => {
    try {
      const res = await api.get('/songs');
      const songs: Song[] = res.data.data.map((song: any) => ({
        id: song.id,
        title: song.title,
        url: song.url,
        duration: song.duration,
        file_size: song.file_size,
      }));
      setAllSongs(songs);
    } catch (e) {
      console.log('Failed to load songs:', e);
    }
  };

  useEffect(() => {
    loadPlaylists();
    loadAllSongs();
  }, []);

  const handleAddPlaylist = async () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    const data = await AsyncStorage.getItem(PLAYLISTS_KEY);
    const stored: { [name: string]: Song[] } = data ? JSON.parse(data) : {};
    if (stored[name]) {
      alert('Playlist already exists!');
      return;
    }
    stored[name] = [];
    await savePlaylists(stored);
    setModalVisible(false);
    setModalMode(null);
    setNewPlaylistName('');
  };

  const openPlaylistModal = (playlist: { name: string; songs: Song[] }) => {
    setSelectedPlaylist(playlist);
    setSelectedSongs(new Set());
    setModalMode('playlistDetails');
    setModalVisible(true);
  };

  const toggleSongSelection = (songId: string) => {
    const newSet = new Set(selectedSongs);
    if (newSet.has(songId)) newSet.delete(songId);
    else newSet.add(songId);
    setSelectedSongs(newSet);
  };

  const handleAddSelectedSongs = async () => {
    if (!selectedPlaylist) return;
    const data = await AsyncStorage.getItem(PLAYLISTS_KEY);
    const stored: { [name: string]: Song[] } = data ? JSON.parse(data) : {};
    const list = stored[selectedPlaylist.name] || [];

    const songsToAdd = allSongs.filter((s) => selectedSongs.has(s.id));
    songsToAdd.forEach((s) => {
      if (!list.find((item) => item.id === s.id)) list.push(s);
    });

    stored[selectedPlaylist.name] = list;
    await savePlaylists(stored);
    setSelectedPlaylist({ ...selectedPlaylist, songs: list });
    setSelectedSongs(new Set());
    setModalMode('playlistDetails'); // back to playlist view
  };

  const removeSongFromPlaylist = async (songId: string) => {
    if (!selectedPlaylist) return;
    const data = await AsyncStorage.getItem(PLAYLISTS_KEY);
    const stored: { [name: string]: Song[] } = data ? JSON.parse(data) : {};
    const updated = (stored[selectedPlaylist.name] || []).filter((s) => s.id !== songId);
    stored[selectedPlaylist.name] = updated;
    await savePlaylists(stored);
    setSelectedPlaylist({ ...selectedPlaylist, songs: updated });
  };

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Playlists</Text>
      </View>

      {/* Add Playlist Button */}
      <View style={styles.addPlaylistContainer}>
        <TouchableOpacity
          style={styles.addPlaylistButton}
          onPress={() => {
            setModalMode('newPlaylist');
            setModalVisible(true);
          }}
        >
          <IconSymbol name="plus" size={20} color={PRIMARY} />
          <Text style={styles.addPlaylistText}>New Playlist</Text>
        </TouchableOpacity>
      </View>

      {/* Playlist List */}
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
            <TouchableOpacity
            style={[styles.playlistRow, selectedPlaylist?.name === item.name && { borderColor: PRIMARY }]}
            onPress={() => openPlaylistModal(item)}
            >
            <View style={styles.playlistIconRow}>
                <IconSymbol name="music.note.list" size={36} color={PRIMARY} />
            </View>
            <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{item.name}</Text>
                <Text style={styles.playlistCount}>
                {item.songs.length} {item.songs.length === 1 ? 'song' : 'songs'}
                </Text>
            </View>
            </TouchableOpacity>
        )}
        />


      {/* SINGLE MODAL FOR ALL PURPOSES */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {modalMode === 'newPlaylist' && (
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Playlist</Text>
              <TextInput
                style={[styles.input, { borderColor: PRIMARY, color: TEXT }]}
                placeholder="Enter playlist name"
                placeholderTextColor="#999"
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                onSubmitEditing={handleAddPlaylist}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 16 }}>
                  <Text style={{ color: '#555' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddPlaylist}>
                  <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {modalMode === 'playlistDetails' && selectedPlaylist && (
            <View style={styles.modalContentLarge}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedPlaylist.name}</Text>
                <TouchableOpacity
                  style={styles.addSongButton}
                  onPress={() => setModalMode('addSongs')}
                >
                  <IconSymbol name="plus" size={18} color="#fff" />
                  <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 6 }}>Add Songs</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={selectedPlaylist.songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SongCard
                    song={item}
                    onPress={playSong}
                    rightAction={
                      <TouchableOpacity onPress={() => removeSongFromPlaylist(item.id)} style={styles.removeButton}>
                        <MaterialIcons name="cancel" size={20} color="#E53935" />
                      </TouchableOpacity>
                    }
                  />
                )}
                style={{ marginTop: 12 }}
              />

              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {modalMode === 'addSongs' && selectedPlaylist && (
            <View style={styles.modalContentLarge}>
              <Text style={styles.modalTitle}>Add Songs</Text>
              <FlatList
                data={allSongs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <SongSelectableRow
                    song={item}
                    selected={selectedSongs.has(item.id)}
                    onToggle={toggleSongSelection}
                  />
                )}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                <TouchableOpacity onPress={() => setModalMode('playlistDetails')} style={{ marginRight: 16 }}>
                  <Text style={{ color: '#555' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddSelectedSongs}>
                  <Text style={{ color: PRIMARY, fontWeight: 'bold' }}>Add Selected</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    playlistRow: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: CARD,
  padding: 12,
  marginBottom: 12,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: 'transparent',
},
playlistIconRow: {
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: ICON_BG,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
playlistInfo: {
  flex: 1,
},
playlistName: { fontWeight: '600', color: TEXT, fontSize: 16 },
playlistCount: { fontSize: 12, color: '#555', marginTop: 2 },

  header: { backgroundColor: PRIMARY, height: 80, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addPlaylistContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  addPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ICON_BG,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  addPlaylistText: { color: TEXT, fontWeight: '600' },
  playlistCard: {
    width: 100,
    height: 100,
    backgroundColor: CARD,
    marginRight: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  playlistIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: ICON_BG, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  modalOverlay: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: BG, borderRadius: 16, padding: 16 },
  modalContentLarge: { width: '90%', maxHeight: '80%', backgroundColor: BG, borderRadius: 16, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  addSongButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: PRIMARY, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  closeModalButton: { marginTop: 12, alignSelf: 'center' },
  songRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  addSongCircle: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  removeButton: { marginLeft: 12, padding: 6, borderRadius: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12 },
});
