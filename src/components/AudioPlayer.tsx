import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  autoStart?: boolean;
  enabled?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, autoStart = false, enabled = true }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled || !audioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
    } else {
      audioRef.current.src = audioUrl;
    }

    if (autoStart) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser autoplay policy might block audio until direct user gesture
          setIsPlaying(false);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl, enabled, autoStart]);

  if (!enabled || !audioUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback error:', err));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        id="btn-toggle-music"
        onClick={togglePlay}
        title={isPlaying ? 'Matikan Musik' : 'Putar Musik'}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 backdrop-blur-md ${
          isPlaying
            ? 'bg-[#D4AF37] text-[#0B132B] ring-4 ring-[#D4AF37]/30 animate-spin-slow'
            : 'bg-[#0B132B]/80 text-white hover:bg-[#0B132B]'
        }`}
        style={{ animationDuration: '8s' }}
      >
        {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5 text-gray-300" />}
      </button>
    </div>
  );
};
