"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Autoplay can be unreliable, we'll try to play when user interacts.
    if(hasInteracted) {
        if (isPlaying) {
            audioRef.current?.play().catch(console.error);
        } else {
            audioRef.current?.pause();
        }
    }
  }, [isPlaying, hasInteracted]);

  const togglePlay = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/karthikeya_2_bgm.mp3" loop />
      <Button
        id="toggleAudio"
        onClick={togglePlay}
        className="fixed top-4 right-4 p-2 bg-yellow-200 hover:bg-yellow-300 rounded-full shadow-md z-50 text-xl"
      >
        {isPlaying ? '🔊' : '🔇'}
      </Button>
    </>
  );
}
