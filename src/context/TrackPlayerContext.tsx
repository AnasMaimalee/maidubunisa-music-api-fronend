// src/context/TrackPlayerContext.tsx - SINGLE GLOBAL PLAYER
import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { Platform, Alert } from 'react-native';
import { Song } from '../components/SongCard';

type PlaybackState = 'playing' | 'paused' | 'stopped' | 'loading';

interface TrackPlayerContextType {
  playSong: (song: Song | null) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  skipToNext: () => void;
  skipToPrevious: () => void;
  toggleLoop: () => Promise<void>;
  toggleShuffle: () => void;
  playbackState: PlaybackState;
  currentSong: Song | null;
  position: number;
  duration: number;
  isLoading: boolean;
  isLooping: boolean;
  isShuffling: boolean;
}

const TrackPlayerContext = createContext<TrackPlayerContextType | null>(null);

export function TrackPlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null); // 🔥 SINGLE GLOBAL INSTANCE
  
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Position tracking
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

  // Cleanup
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
    } catch (e) {}

    console.log('📥 Downloading:', song.title);
    const downloadRes = await FileSystemLegacy.downloadAsync(song.url!, localUri);
    if (downloadRes.status !== 200) {
      throw new Error(`Download failed: ${downloadRes.status}`);
    }
    return localUri;
  };

  const playSong = async (song: Song | null) => {
    if (!song?.url) return;

    console.log('🎵 SINGLE PLAYER - Playing:', song.title);
    setIsLoading(true);
    setPlaybackState('loading');

    try {
      // 🔥 STOP PREVIOUS SONG FIRST (CRITICAL)
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      let sourceUri = song.url;
      if (Platform.OS !== 'web') {
        sourceUri = await getMobileSource(song);
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: sourceUri },
        {
          shouldPlay: true,
          isLooping: false,
          progressUpdateIntervalMillis: 1000,
          playsInSilentModeIOS: true,
          stayAwake: true,
          volume: 1.0,
        },
        (status) => {
          if (status.error) {
            console.error('❌ Audio error:', status.error);
            setPlaybackState('stopped');
            return;
          }
          if (status.isLoaded === true) {
            if (status.didJustFinish && !isLooping) {
              setPlaybackState('stopped');
              setCurrentSong(null);
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
      console.log('✅ SINGLE SONG PLAYING');

    } catch (error: any) {
      console.error('❌ Play failed:', error.message);
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
          await soundRef.current.pauseAsync();
        } else {
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

  const value: TrackPlayerContextType = {
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

  return (
    <TrackPlayerContext.Provider value={value}>
      {children}
    </TrackPlayerContext.Provider>
  );
}

export const useTrackPlayerContext = () => {
  const context = useContext(TrackPlayerContext);
  if (!context) {
    throw new Error('useTrackPlayerContext must be used within TrackPlayerProvider');
  }
  return context;
};
