// File: src/hooks/useTrackPlayer.ts
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Song } from '../components/SongCard';

export default function useTrackPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<'playing' | 'paused' | 'stopped'>('stopped');
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const playSong = async (song: Song) => {
    if (Platform.OS === 'web') {
      console.warn('Audio playback is disabled on web.');
      return;
    }

    if (!song.url) {
      console.warn('No song URL provided.');
      return;
    }

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true, isLooping }
      );

      soundRef.current = sound;
      setCurrentSong(song);
      setPlaybackState('playing');

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        if (status.didJustFinish && !isLooping) {
          setPlaybackState('stopped');
        }
      });
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    const status = await soundRef.current.getStatusAsync();

    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setPlaybackState('paused');
    } else {
      await soundRef.current.playAsync();
      setPlaybackState('playing');
    }
  };

  const skipToNext = async () => {
    console.log('Skip to next song triggered'); 
    // You can integrate with a playlist later
  };

  const skipToPrevious = async () => {
    console.log('Skip to previous song triggered'); 
    // You can integrate with a playlist later
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
    if (soundRef.current) {
      soundRef.current.setIsLoopingAsync(!isLooping);
    }
  };

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev);
  };

  return {
    playSong,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    toggleLoop,
    toggleShuffle,
    playbackState,
    isLooping,
    isShuffling,
    currentSong,
  };
}
