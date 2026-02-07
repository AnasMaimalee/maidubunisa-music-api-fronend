// File: src/hooks/useTrackPlayer.ts
import { useState } from 'react';

/**
 * MOCK TrackPlayer (Expo / Web safe)
 * Later you can swap this with react-native-track-player
 */
const TrackPlayer = {
  setupPlayer: async () => console.log('Player setup'),
  reset: async () => console.log('Player reset'),
  add: async (tracks: any[]) => console.log('Tracks added', tracks),
  skip: async (trackId: string) => console.log('Skipped to track', trackId),
  getTrack: async (trackId: string) => ({ id: trackId, title: 'Sample Track' }),
  getState: async () => 'paused',
  play: async () => console.log('play'),
  pause: async () => console.log('pause'),
  skipToNext: async () => console.log('skip next'),
  skipToPrevious: async () => console.log('skip previous'),
  setRepeatMode: (mode: string) => console.log('repeat mode', mode),
  REPEAT_TRACK: 'repeat-track',
  REPEAT_OFF: 'repeat-off',
};

const Event = {
  PlaybackTrackChanged: 'playback-track-changed',
};

// Mock hooks
const usePlaybackState = () => 'paused';
const useTrackPlayerEvents = (_events: string[], _callback: (event: any) => void) => {};

// -----------------------------------

export interface Track {
  id: string;
  url?: string;
  title?: string;
  artist?: string;
  artwork?: string;
}

const useTrackPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const playbackState = usePlaybackState();
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  /**
   * Setup playlist
   */
  const setupPlayer = async (songs: Track[], startTrackId?: string) => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.reset();

    await TrackPlayer.add(
      songs.map((song) => ({
        id: song.id,
        url: song.url,
        title: song.title,
        artist: song.artist,
        artwork: song.artwork,
      }))
    );

    if (startTrackId) {
      await TrackPlayer.skip(startTrackId);
      setCurrentTrack(await TrackPlayer.getTrack(startTrackId));
      await TrackPlayer.play();
    }
  };

  /**
   * ✅ THIS IS WHAT WAS MISSING
   * Play a single song
   */
  const playSong = async (song: Track) => {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.reset();

    await TrackPlayer.add([
      {
        id: song.id,
        url: song.url,
        title: song.title,
        artist: song.artist,
        artwork: song.artwork,
      },
    ]);

    await TrackPlayer.play();
    setCurrentTrack(song);
  };

  const togglePlayPause = async () => {
    const state = await TrackPlayer.getState();
    if (state === 'playing') {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
      const track = await TrackPlayer.getTrack('next');
      setCurrentTrack(track);
    } catch {
      console.log('No next track');
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      const track = await TrackPlayer.getTrack('previous');
      setCurrentTrack(track);
    } catch {
      console.log('No previous track');
    }
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    TrackPlayer.setRepeatMode(next ? TrackPlayer.REPEAT_TRACK : TrackPlayer.REPEAT_OFF);
  };

  const toggleShuffle = () => {
    setIsShuffling((prev) => !prev);
    console.log('shuffle toggled');
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event?.nextTrack) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });

  return {
    // state
    currentTrack,
    playbackState,
    isLooping,
    isShuffling,

    // actions
    setupPlayer,
    playSong,          // ✅ exposed
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    toggleLoop,
    toggleShuffle,
  };
};

export default useTrackPlayer;
