// src/hooks/useTrackPlayer.ts - PHONE + WEB PERFECT
import { useRef, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { Platform, Alert } from 'react-native';
import { Song } from '../components/SongCard';

export default function useTrackPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'stopped' | 'loading'>('stopped');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updatePosition = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded === true) {
        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 0);
      }
    } catch (e) {
      console.error('Position error:', e);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playbackState === 'playing') {
      interval = setInterval(updatePosition, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackState, updatePosition]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const getMobileSource = async (song: Song): Promise<string> => {
    const fileName = `${song.id}.mp3`;
    const localUri = `${FileSystemLegacy.cacheDirectory}${fileName}`;
    
    try {
      const { exists } = await FileSystemLegacy.getInfoAsync(localUri);
      if (exists) {
        console.log('✅ Using cached:', fileName);
        return localUri;
      }
    } catch (e) {
      console.log('No cache, downloading...');
    }

    console.log('📥 Downloading:', song.title);
    const downloadRes = await FileSystemLegacy.downloadAsync(song.url!, localUri);
    if (downloadRes.status !== 200) {
      throw new Error(`Download failed: ${downloadRes.status}`);
    }
    console.log('✅ Download OK');
    return localUri;
  };

  const playSong = async (song: Song | null) => {
    if (!song?.url) {
      console.error('❌ No song URL');
      return;
    }

    console.log('🎵 Loading:', song.title, 'Platform:', Platform.OS);
    setIsLoading(true);
    setPlaybackState('loading');

    try {
      // FULL CLEANUP
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      let sourceUri = song.url;
      if (Platform.OS !== 'web') {
        sourceUri = await getMobileSource(song);
      }

      // 🔥 PHONE AUDIO CONFIG
      const source = { uri: sourceUri };
      const { sound } = await Audio.Sound.createAsync(
        source,
        {
          shouldPlay: true,
          isLooping: false,
          progressUpdateIntervalMillis: 1000,
          // 🔥 CRITICAL PHONE FIXES
          playsInSilentModeIOS: true,
          stayAwake: true,
          volume: 1.0,
          rate: 1.0,
        },
        (status) => {
          console.log('📊 Status:', {
            isLoaded: status.isLoaded,
            isPlaying: status.isPlaying,
            position: status.positionMillis,
            duration: status.durationMillis
          });

          if (status.error) {
            console.error('❌ Audio error:', status.error);
            setPlaybackState('stopped');
            return;
          }

          if (status.isLoaded === true) {
            if (status.didJustFinish && !isLooping) {
              setPlaybackState('stopped');
              setCurrentSong(null);
              setPosition(0);
            } else if (status.isPlaying === true) {
              setPlaybackState('playing');
            } else {
              setPlaybackState('paused');
            }
            setDuration(status.durationMillis ?? 0);
          }
          setIsLoading(false);
        }
      );

      soundRef.current = sound;
      setCurrentSong(song);
      console.log('✅ PHONE PLAYING:', sourceUri);

    } catch (error: any) {
      console.error('❌ FAILED:', error.message);
      setPlaybackState('stopped');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded === true) {
        if (status.isPlaying === true) {
          console.log('⏸️ Pausing');
          await soundRef.current.pauseAsync();
        } else {
          console.log('▶️ Playing');
          await soundRef.current.playAsync();
        }
      }
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const seekTo = async (positionMillis: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(positionMillis);
    }
  };

  const skipToNext = () => console.log('⏭️ Next');
  const skipToPrevious = () => console.log('⏮️ Previous');
  const toggleLoop = async () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    if (soundRef.current) {
      await soundRef.current.setIsLoopingAsync(newLoop);
    }
  };
  const toggleShuffle = () => setIsShuffling(prev => !prev);

  return {
    playSong,
    togglePlayPause,
    seekTo,
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
  };
}
