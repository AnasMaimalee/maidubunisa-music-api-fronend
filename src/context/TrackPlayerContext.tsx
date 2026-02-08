// src/context/TrackPlayerContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface TrackPlayerContextType {
  speed: number;
  looping: boolean;
  shuffling: boolean;
  setSpeed: (s: number) => void;
  setLooping: (b: boolean) => void;
  setShuffling: (b: boolean) => void;
}

export const TrackPlayerContext = createContext<TrackPlayerContextType | undefined>(undefined);

interface Props { children: ReactNode }

export const TrackPlayerProvider: React.FC<Props> = ({ children }) => {
  const [speed, setSpeed] = useState(1);
  const [looping, setLooping] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  return (
    <TrackPlayerContext.Provider value={{ speed, looping, shuffling, setSpeed, setLooping, setShuffling }}>
      {children}
    </TrackPlayerContext.Provider>
  );
};
