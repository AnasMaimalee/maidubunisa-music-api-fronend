// File: src/services/OfflineContentService.js

import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TrackPlayer from 'react-native-track-player';
import { Alert } from 'react-native';

// Constants
const STORAGE_KEY_METADATA = '@music_metadata';
const SONGS_DIR = `${RNFS.DocumentDirectoryPath}/songs`;
const COVERS_DIR = `${RNFS.DocumentDirectoryPath}/covers`;

class OfflineContentService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }

  /** Initialize storage directories */
  async init() {
    try {
      const songDirExists = await RNFS.exists(SONGS_DIR);
      if (!songDirExists) await RNFS.mkdir(SONGS_DIR);

      const coverDirExists = await RNFS.exists(COVERS_DIR);
      if (!coverDirExists) await RNFS.mkdir(COVERS_DIR);
    } catch (error) {
      console.error('Error initializing directories:', error);
    }
  }

  /** Fetch metadata from API and download any new content */
  async syncContent() {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/v1/albums`);
      const albums = response.data || [];

      const metadata = [];

      for (const album of albums) {
        // Download album cover
        const coverPath = await this.downloadFile(album.cover_url, COVERS_DIR, album.id + '.jpg');

        const albumData = {
          id: album.id,
          title: album.title,
          cover: coverPath,
          songs: [],
        };

        // Download songs in this album
        const songsResponse = await axios.get(`${this.apiBaseUrl}/v1/albums/${album.id}/songs`);
        const songs = songsResponse.data || [];

        for (const song of songs) {
          const songPath = await this.downloadFile(song.url, SONGS_DIR, song.id + '.mp3');

          albumData.songs.push({
            id: song.id,
            title: song.title,
            artist: song.artist,
            filePath: songPath,
          });
        }

        metadata.push(albumData);
      }

      // Save metadata locally
      await AsyncStorage.setItem(STORAGE_KEY_METADATA, JSON.stringify(metadata));
      return metadata;
    } catch (error) {
      console.error('Error syncing content:', error);
      Alert.alert('Sync Error', 'Failed to sync songs and albums.');
      return [];
    }
  }

  /** Download a file if it doesn't exist */
  async downloadFile(url, dir, fileName) {
    try {
      const filePath = `${dir}/${fileName}`;
      const exists = await RNFS.exists(filePath);
      if (!exists) {
        const downloadResult = await RNFS.downloadFile({
          fromUrl: url,
          toFile: filePath,
        }).promise;

        if (downloadResult.statusCode === 200) {
          console.log(`Downloaded: ${fileName}`);
        } else {
          console.warn(`Failed to download ${fileName}, status: ${downloadResult.statusCode}`);
        }
      }
      return filePath;
    } catch (error) {
      console.error('Download error:', error);
      return null;
    }
  }

  /** Get all albums from local storage */
  async getAlbums() {
    const metadata = await AsyncStorage.getItem(STORAGE_KEY_METADATA);
    return metadata ? JSON.parse(metadata) : [];
  }

  /** Get songs for a specific album */
  async getSongs(albumId) {
    const albums = await this.getAlbums();
    const album = albums.find(a => a.id === albumId);
    return album ? album.songs : [];
  }

  /** Add tracks to TrackPlayer for playback */
  async setupTrackPlayer() {
    const albums = await this.getAlbums();
    const tracks = [];

    for (const album of albums) {
      for (const song of album.songs) {
        tracks.push({
          id: song.id,
          url: `file://${song.filePath}`,
          title: song.title,
          artist: song.artist,
          artwork: `file://${album.cover}`,
        });
      }
    }

    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
  }
}

// Export singleton
export default new OfflineContentService('http://localhost:8000/api');
