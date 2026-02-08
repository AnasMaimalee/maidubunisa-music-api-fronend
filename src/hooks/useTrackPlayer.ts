// src/hooks/useTrackPlayer.ts - FULLY FUNCTIONAL
import { useRef, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { Song } from '../components/SongCard';

// 🔥 GLOBAL SINGLETON
let GLOBAL_SOUND_REF: Audio.Sound | null = null;
let IS_INITIALIZED = false;

export default function useTrackPlayer() {
  // 🔥 ALL STATES - CRITICAL FOR ICONS
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

  // 🔥 POSITION TRACKER - UPDATES EVERY SECOND
  const updatePosition = useCallback(async () => {
    if (!GLOBAL_SOUND_REF) return;
    try {
      const status = await GLOBAL_SOUND_REF.getStatusAsync();
      if (status.isLoaded === true) {
        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 0);
        
        // 🔥 AUTO STOP WHEN SONG ENDS
        if (status.didJustFinish === true) {
          setPlaybackState('stopped');
        }
      }
    } catch (e) {
      console.log('Position update error:', e);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playbackState === 'playing') {
      interval = setInterval(updatePosition, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackState, updatePosition]);

  // 🔥 STOP ALL PREVIOUS
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

  // 🔥 MAIN PLAY FUNCTION
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
        { shouldPlay: true, isLooping: false, progressUpdateIntervalMillis: 1000 },
        (status) => {
          console.log('🔊 Status:', status.isPlaying, status.isLoaded, status.didJustFinish);
          
          if (status.isLoaded === true) {
            setDuration(status.durationMillis ?? 0);
            if (status.isPlaying === true) {
              setPlaybackState('playing'); // ✅ ICON CHANGES HERE
            } else if (status.didJustFinish === true) {
              setPlaybackState('stopped'); // ✅ ICON CHANGES HERE
            } else {
              setPlaybackState('paused');
            }
          }
          setIsLoading(false);
        }
      );

      GLOBAL_SOUND_REF = sound;
      setCurrentSong(song);
      setPlaylist(newPlaylist);
      setCurrentIndex(index);
      console.log('✅ Playing:', song.title);

    } catch (error) {
      console.error('❌ Play error:', error);
      setPlaybackState('stopped');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 TOGGLE PLAY/PAUSE - ICONS CHANGE HERE
  const togglePlayPause = async () => {
    if (!GLOBAL_SOUND_REF) return;

    try {
      const status = await GLOBAL_SOUND_REF.getStatusAsync();
      if (status.isLoaded === true) {
        if (status.isPlaying === true) {
          await GLOBAL_SOUND_REF.pauseAsync();
          setPlaybackState('paused'); // ✅ ICON → PLAY
          console.log('⏸️ Paused');
        } else {
          await GLOBAL_SOUND_REF.playAsync();
          setPlaybackState('playing'); // ✅ ICON → PAUSE
          console.log('▶️ Playing');
        }
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  // 🔥 NEXT SONG
  const skipToNext = async () => {
    if (playlist.length === 0 || currentIndex >= playlist.length - 1) return;
    const nextIndex = currentIndex + 1;
    await playSong(playlist[nextIndex], playlist, nextIndex);
    console.log('⏭️ Next:', playlist[nextIndex]?.title);
  };

  // 🔥 PREVIOUS SONG
  const skipToPrevious = async () => {
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    await playSong(playlist[prevIndex], playlist, prevIndex);
    console.log('⏮️ Previous:', playlist[prevIndex]?.title);
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
    console.log('🔀 Shuffle:', !isShuffling);
  };

  return {
    playSong,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    toggleLoop,
    toggleShuffle,
    stopSong: stopAllPrevious, // 🔥 STOP
    playbackState,      // ✅ ICONS USE THIS
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
