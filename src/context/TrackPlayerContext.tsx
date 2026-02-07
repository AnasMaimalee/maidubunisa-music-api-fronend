// src/context/TrackPlayerContext.tsx
import React, { createContext, useContext } from 'react';
import useTrackPlayer from '../hooks/useTrackPlayer';

const TrackPlayerContext = createContext<ReturnType<typeof useTrackPlayer> | null>(null);

export const TrackPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const trackPlayer = useTrackPlayer();

  return (
    <TrackPlayerContext.Provider value={trackPlayer}>
      {children}
    </TrackPlayerContext.Provider>
  );
};

export const useTrackPlayerContext = () => {
  const context = useContext(TrackPlayerContext);
  if (!context) {
    throw new Error('useTrackPlayerContext must be used inside TrackPlayerProvider');
  }
  return context;
};
