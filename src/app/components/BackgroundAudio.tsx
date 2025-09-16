
"use client";
import { useRef, useState, useEffect } from 'react';

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    // Autoplay can be unreliable, we'll try to play when user interacts.
    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
    };
    
    document.addEventListener('click', playAudio, { once: true });

    return () => {
        document.removeEventListener('click', playAudio);
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden">
      <audio ref={audioRef} muted={muted}>
        <source src="/audio/karthikeya_2_bgm.mp3" type="audio/mpeg" />
      </audio>
      <button
        className="bg-yellow-500 text-black px-4 py-1 rounded shadow"
        onClick={() => setMuted(!muted)}
      >
        {muted ? '🔇 Unmute' : '🔊 Mute'}
      </button>
    </div>
  );
}
