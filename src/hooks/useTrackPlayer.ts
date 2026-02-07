import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { useRef } from 'react';
import { Song } from '../components/SongCard';

export default function useTrackPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const playSong = async (song: Song) => {
    if (Platform.OS === 'web') {
      console.warn('Audio playback disabled on web');
      return;
    }

    if (!song.url) return;

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true }
      );

      soundRef.current = sound;
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  return { playSong };
}
