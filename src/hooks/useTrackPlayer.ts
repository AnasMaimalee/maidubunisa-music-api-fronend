// File: src/hooks/useTrackPlayer.ts
import { useState } from 'react';

// --- Mock TrackPlayer for Expo testing ---
const TrackPlayer = {
  setupPlayer: async () => console.log('Player setup'),
  reset: async () => console.log('Player reset'),
  add: async (tracks: any[]) => console.log('Tracks added', tracks),
  skip: async (trackId: string) => console.log('Skipped to track', trackId),
  getTrack: async (trackId: string) => ({ id: trackId, title: 'Sample Track' }),
  getState: async () => 'paused',
  play: () => console.log('play'),
  pause: () => console.log('pause'),
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

  const setupPlayer = async (songs: Track[] = [], startTrackId: string | null = null) => {
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
    }
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
      const track = await TrackPlayer.getTrack('next-track-id');
      setCurrentTrack(track);
    } catch {
      console.log('No next track');
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
      const track = await TrackPlayer.getTrack('prev-track-id');
      setCurrentTrack(track);
    } catch {
      console.log('No previous track');
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    TrackPlayer.setRepeatMode(!isLooping ? TrackPlayer.REPEAT_TRACK : TrackPlayer.REPEAT_OFF);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
    console.log('shuffle toggled');
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event?.nextTrack != null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setCurrentTrack(track);
    }
  });

  return {
    currentTrack,
    playbackState,
    isLooping,
    isShuffling,
    setupPlayer,
    togglePlayPause,
    skipToNext,
    skipToPrevious,
    toggleLoop,
    toggleShuffle,
  };
};

export default useTrackPlayer;
