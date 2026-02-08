<<<<<<< HEAD
// src/hooks/useTrackPlayer.ts - STARTS WITH PAUSE ICON
=======
// src/hooks/useTrackPlayer.ts - PHONE + WEB PERFECT
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
import { useRef, useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { Platform, Alert } from 'react-native';
import { Song } from '../components/SongCard';

export default function useTrackPlayer() {
<<<<<<< HEAD
=======
  const soundRef = useRef<Audio.Sound | null>(null);
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'stopped' | 'loading'>('stopped');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
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

=======
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
  const updatePosition = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded === true) {
        setPosition(status.positionMillis ?? 0);
        setDuration(status.durationMillis ?? 0);
<<<<<<< HEAD
        if (status.didJustFinish === true) {
          setPlaybackState('stopped');
        }
      }
    } catch (e) {}
=======
      }
    } catch (e) {
      console.error('Position error:', e);
    }
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playbackState === 'playing') {
      interval = setInterval(updatePosition, 1000);
    }
    return () => clearInterval(interval);
  }, [playbackState, updatePosition]);

<<<<<<< HEAD
  const stopAllPrevious = async () => {
    if (GLOBAL_SOUND_REF) {
      try {
        await GLOBAL_SOUND_REF.stopAsync();
        await GLOBAL_SOUND_REF.unloadAsync();
      } catch (e) {}
      GLOBAL_SOUND_REF = null;
=======
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
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
    }

    console.log('📥 Downloading:', song.title);
    const downloadRes = await FileSystemLegacy.downloadAsync(song.url!, localUri);
    if (downloadRes.status !== 200) {
      throw new Error(`Download failed: ${downloadRes.status}`);
    }
    console.log('✅ Download OK');
    return localUri;
  };

<<<<<<< HEAD
  // 🔥 MAIN FIX - STARTS WITH PAUSE ICON
  const playSong = async (song: Song, newPlaylist: Song[] = [], index = 0) => {
    await initAudio();
=======
  const playSong = async (song: Song | null) => {
    if (!song?.url) {
      console.error('❌ No song URL');
      return;
    }

    console.log('🎵 Loading:', song.title, 'Platform:', Platform.OS);
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
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
<<<<<<< HEAD
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
=======
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
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
          }
          setIsLoading(false);
        }
      );

      soundRef.current = sound;
      setCurrentSong(song);
<<<<<<< HEAD
      setPlaylist(newPlaylist);
      setCurrentIndex(index);
      
      // 🔥 GUARANTEE PLAYING STATE FOR PAUSE ICON
      setPlaybackState('playing');
      console.log('✅ STARTED PLAYING - PAUSE ICON SHOWING');
=======
      console.log('✅ PHONE PLAYING:', sourceUri);
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)

    } catch (error: any) {
      console.error('❌ FAILED:', error.message);
      setPlaybackState('stopped');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
<<<<<<< HEAD
    if (!GLOBAL_SOUND_REF) return;
=======
    if (!soundRef.current) return;
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded === true) {
        if (status.isPlaying === true) {
<<<<<<< HEAD
          await GLOBAL_SOUND_REF.pauseAsync();
          setPlaybackState('paused');
        } else {
          await GLOBAL_SOUND_REF.playAsync();
          setPlaybackState('playing');
=======
          console.log('⏸️ Pausing');
          await soundRef.current.pauseAsync();
        } else {
          console.log('▶️ Playing');
          await soundRef.current.playAsync();
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
        }
      }
    } catch (e) {}
  };

<<<<<<< HEAD
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
=======
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
>>>>>>> parent of d226c5a (fix: playercontrol pause:play)
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
