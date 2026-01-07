'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

type Genre = 'afro' | 'hiphop' | 'pop' | 'jazz';

const MUSIC_BANK: Record<Genre, string[]> = {
  afro: ['/audio/afro/afro1.mp3', '/audio/afro/afro2.mp3'],
  hiphop: ['/audio/hiphop/hip1.mp3', '/audio/hiphop/hip2.mp3'],
  pop: ['/audio/pop/pop1.mp3', '/audio/pop/pop2.mp3'],
  jazz: ['/audio/jazz/jazz1.mp3', '/audio/jazz/jazz2.mp3'],
};

type MusicContextType = {
  isPlaying: boolean;
  genre: Genre | null;
  volume: number;
  playGenre: (g: Genre) => void;
  toggle: () => void;
  setVolume: (v: number) => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [genre, setGenre] = useState<Genre | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.18);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    audioRef.current.onended = () => {
      setTrackIndex((prev) => prev + 1);
    };

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!genre || !audioRef.current) return;

    const playlist = MUSIC_BANK[genre];
    const track = playlist[trackIndex % playlist.length];

    audioRef.current.src = track;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        localStorage.setItem('musicEnabled', 'true');
      })
      .catch(() => {
        setIsPlaying(false);
      });

    localStorage.setItem('musicGenre', genre);
  }, [trackIndex, genre]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      localStorage.setItem('musicVolume', volume.toString());
    }
  }, [volume]);

  useEffect(() => {
    const savedGenre = localStorage.getItem('musicGenre') as Genre | null;
    const enabled = localStorage.getItem('musicEnabled');
    const savedVolume = localStorage.getItem('musicVolume');

    if (savedVolume) {
      setVolumeState(Number(savedVolume));
    }

    if (savedGenre && enabled === 'true') {
      setGenre(savedGenre);
    }
  }, []);
  const playGenre = (g: Genre) => {
    setTrackIndex(0);
    setGenre(g);
  };

  const toggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem('musicEnabled', 'false');
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem('musicEnabled', 'true');
        })
        .catch(() => {});
    }
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        genre,
        volume,
        playGenre,
        toggle,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error('useMusic must be used inside MusicProvider');
  }
  return ctx;
}
