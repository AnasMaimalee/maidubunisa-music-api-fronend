// File: src/services/PlaylistService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song } from '../components/SongCard';

const PLAYLIST_KEY = 'playlists';

export default {
  getPlaylists: async (): Promise<string[]> => {
    const raw = await AsyncStorage.getItem(PLAYLIST_KEY);
    return raw ? JSON.parse(raw) : ['My Playlist'];
  },

  createPlaylist: async (name: string): Promise<void> => {
    const playlists = await AsyncStorage.getItem(PLAYLIST_KEY);
    const list = playlists ? JSON.parse(playlists) : [];
    if (!list.includes(name)) list.push(name);
    await AsyncStorage.setItem(PLAYLIST_KEY, JSON.stringify(list));
  },

  getSongs: async (playlistName: string): Promise<Song[]> => {
    const raw = await AsyncStorage.getItem(`playlist:${playlistName}`);
    return raw ? JSON.parse(raw) : [];
  },

  addSong: async (playlistName: string, song: Song): Promise<void> => {
    const raw = await AsyncStorage.getItem(`playlist:${playlistName}`);
    const songs = raw ? JSON.parse(raw) : [];
    songs.push(song);
    await AsyncStorage.setItem(`playlist:${playlistName}`, JSON.stringify(songs));
  },

  removeSong: async (playlistName: string, songId: string): Promise<void> => {
    const raw = await AsyncStorage.getItem(`playlist:${playlistName}`);
    let songs = raw ? JSON.parse(raw) : [];
    songs = songs.filter((s: Song) => s.id !== songId);
    await AsyncStorage.setItem(`playlist:${playlistName}`, JSON.stringify(songs));
  },
};
