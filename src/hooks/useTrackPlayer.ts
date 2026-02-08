// src/hooks/useTrackPlayer.ts - STARTS WITH PAUSE ICON
import { useRef, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { Song } from '../components/SongCard';

// 🔥 GLOBAL SINGLETON
let GLOBAL_SOUND_REF: Audio.Sound | null = null;
let IS_INITIALIZED = false;

export default function useTrackPlayer() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'stopped' | 'loading'>('stopped');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const initAudio = async () => {
    if (IS_INITIALIZED) return;
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
      ...(Platform.OS === 'ios' && { interruptionModeIOS: 1 }),
    });
    IS_INITIALIZED = true;
  };

  const updatePosition = useCallback(async () => {
    if (!GLOBAL_SOUND_REF) return;
    try {
      const status = await GLOBAL_SOUND_REF.getStatusAsync();
      if (status.isLoaded === true) {
        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 0);
        if (status.didJustFinish === true) {
          setPlaybackState('stopped');
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playbackState === 'playing') {
      interval = setInterval(updatePosition, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackState, updatePosition]);

  const stopAllPrevious = async () => {
    if (GLOBAL_SOUND_REF) {
      try {
        await GLOBAL_SOUND_REF.stopAsync();
        await GLOBAL_SOUND_REF.unloadAsync();
      } catch (e) {}
      GLOBAL_SOUND_REF = null;
    }
    setPlaybackState('stopped');
    setCurrentSong(null);
    setPosition(0);
  };

  // 🔥 MAIN FIX - STARTS WITH PAUSE ICON
  const playSong = async (song: Song, newPlaylist: Song[] = [], index = 0) => {
    await initAudio();
    setIsLoading(true);
    setPlaybackState('loading');

    try {
      await stopAllPrevious();

      let sourceUri = song.url;
      if (Platform.OS !== 'web') {
        const fileName = `${song.id}.mp3`;
        const localUri = `${FileSystemLegacy.cacheDirectory}${fileName}`;
        try {
          const { exists } = await FileSystemLegacy.getInfoAsync(localUri);
          if (exists) sourceUri = localUri;
          else {
            const downloadRes = await FileSystemLegacy.downloadAsync(song.url!, localUri);
            sourceUri = downloadRes.uri;
          }
        } catch (e) {}
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: sourceUri },
        { 
          shouldPlay: true,  // ✅ AUTO STARTS
          isLooping: false, 
          progressUpdateIntervalMillis: 1000 
        },
        (status) => {
          console.log('🔊 STATUS:', status.isPlaying, status.isLoaded);
          if (status.isLoaded === true) {
            setDuration(status.durationMillis ?? 0);
            // 🔥 IMMEDIATE PLAYING STATE
            setPlaybackState(status.isPlaying === true ? 'playing' : 'paused');
          }
          setIsLoading(false);
        }
      );

      GLOBAL_SOUND_REF = sound;
      setCurrentSong(song);
      setPlaylist(newPlaylist);
      setCurrentIndex(index);
      
      // 🔥 GUARANTEE PLAYING STATE FOR PAUSE ICON
      setPlaybackState('playing');
      console.log('✅ STARTED PLAYING - PAUSE ICON SHOWING');

    } catch (error) {
      console.error('❌ Play error:', error);
      setPlaybackState('stopped');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!GLOBAL_SOUND_REF) return;
    try {
      const status = await GLOBAL_SOUND_REF.getStatusAsync();
      if (status.isLoaded === true) {
        if (status.isPlaying === true) {
          await GLOBAL_SOUND_REF.pauseAsync();
          setPlaybackState('paused');
        } else {
          await GLOBAL_SOUND_REF.playAsync();
          setPlaybackState('playing');
        }
      }
    } catch (e) {}
  };

  const skipToNext = async () => {
    if (playlist.length === 0 || currentIndex >= playlist.length - 1) return;
    const nextIndex = currentIndex + 1;
    await playSong(playlist[nextIndex], playlist, nextIndex);
  };

  const skipToPrevious = async () => {
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    await playSong(playlist[prevIndex], playlist, prevIndex);
  };

  const toggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    if (GLOBAL_SOUND_REF) {
      GLOBAL_SOUND_REF.setIsLoopingAsync(newLoop);
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(prev => !prev);
  };

  return {
    playSong,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    toggleLoop,
    toggleShuffle,
    playbackState,
    currentSong,
    position,
    duration,
    isLoading,
    isLooping,
    isShuffling,
    playlist,
    currentIndex,
  };
}
