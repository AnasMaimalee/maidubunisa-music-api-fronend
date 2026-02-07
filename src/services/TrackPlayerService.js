// File: src/services/TrackPlayerService.js

import TrackPlayer, {
  State,
  RepeatMode,
} from 'react-native-track-player';

/**
 * TrackPlayerService
 * Handles all music playback logic:
 * - Setup player with album songs
 * - Play / Pause / Next / Previous
 * - Loop modes: all | single | shuffle
 * - Seek / getPosition / getDuration
 */

class TrackPlayerService {
  constructor() {
    this.songs = [];
    this.currentIndex = 0;
    this.loopMode = 'all'; // all | single | shuffle
  }

  async setupPlayer(albumSongs, startSongId) {
    this.songs = albumSongs;

    await TrackPlayer.setupPlayer();

    await TrackPlayer.reset();

    // Add songs to queue
    await TrackPlayer.add(
      this.songs.map((song) => ({
        id: song.id,
        url: song.filePath, // local file path or require() path
        title: song.title,
        artist: song.artist || 'Unknown',
        artwork: song.artwork || '', // optional artwork
      }))
    );

    // Set current index to startSongId
    const index = this.songs.findIndex((s) => s.id === startSongId);
    this.currentIndex = index >= 0 ? index : 0;
    await TrackPlayer.skip(this.songs[this.currentIndex].id);
    await TrackPlayer.play();
  }

  async play() {
    await TrackPlayer.play();
  }

  async pause() {
    await TrackPlayer.pause();
  }

  async next(loopMode = 'all') {
    this.loopMode = loopMode;

    if (loopMode === 'shuffle') {
      this.currentIndex = Math.floor(Math.random() * this.songs.length);
    } else if (loopMode === 'single') {
      // do not change currentIndex
    } else {
      // all
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
      }
    }

    const song = this.songs[this.currentIndex];
    await TrackPlayer.skip(song.id);
    await TrackPlayer.play();
    return song;
  }

  async previous(loopMode = 'all') {
    this.loopMode = loopMode;

    if (loopMode === 'shuffle') {
      this.currentIndex = Math.floor(Math.random() * this.songs.length);
    } else if (loopMode === 'single') {
      // do not change currentIndex
    } else {
      this.currentIndex--;
      if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
    }

    const song = this.songs[this.currentIndex];
    await TrackPlayer.skip(song.id);
    await TrackPlayer.play();
    return song;
  }

  async seekTo(position) {
    await TrackPlayer.seekTo(position);
  }

  async getDuration() {
    return await TrackPlayer.getDuration();
  }

  async getPosition() {
    return await TrackPlayer.getPosition();
  }
}

export default new TrackPlayerService();
