'use client';

import { useState } from 'react';
import { useMusic } from '@/providers/MusicProvider';
import { Button } from '@/components/ui/button';
import { Music, Pause, Play } from 'lucide-react';
import MusicEqualizer from './MusicEqualizer';

const GENRES = ['afro', 'hiphop', 'pop', 'jazz'] as const;

export default function MusicFloatingButton() {
  const { playGenre, toggle, isPlaying, genre, volume, setVolume } = useMusic();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {open && (
        <div className="mb-3 w-64 rounded-2xl border border-[#7619bc]/30 bg-[#0f0f1a]/90 backdrop-blur-xl p-4 shadow-xl">
          <p className="mb-3 text-sm font-light text-white/80">Select genre & play music</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {GENRES.map((g) => (
              <Button
                key={g}
                size="sm"
                onClick={() => playGenre(g)}
                className={`capitalize ${
                  genre === g ? 'bg-[#7619bc]' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {g}
              </Button>
            ))}
          </div>

          {genre && (
            <>
              <div className="mb-3 flex items-center justify-between text-xs text-white/70">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-[#7619bc]"
              />

              <Button
                onClick={toggle}
                className="mt-4 w-full bg-[#7619bc]/20 hover:bg-[#7619bc]/30"
              >
                {isPlaying ? (
                  <>
                    <Pause size={16} className="mr-2" /> Mute music
                  </>
                ) : (
                  <>
                    <Play size={16} className="mr-2" /> Play music
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#7619bc]"
      >
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full bg-purple-400 blur-2xl opacity-70 animate-glow" />
            <span className="absolute inset-0 rounded-full bg-fuchsia-500 blur-lg opacity-80 animate-pulse" />
          </>
        )}

        <div className="relative flex items-center justify-center text-white">
          {isPlaying ? <MusicEqualizer active /> : <Music size={22} />}
        </div>
      </button>
    </div>
  );
}
