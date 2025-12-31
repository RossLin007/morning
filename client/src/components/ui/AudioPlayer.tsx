
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { formatDuration } from '@/lib/utils';

interface AudioPlayerProps {
  lessonId: string;
  totalSeconds: number;
  title: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ totalSeconds, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center gap-4">
      <button 
        onClick={togglePlay}
        className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
      >
        <Icon name={isPlaying ? "pause" : "play_arrow"} filled />
      </button>
      
      <div className="flex-1">
        <p className="text-xs font-bold text-text-main dark:text-white mb-1 truncate">{title}</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[10px] font-mono text-gray-400">{formatDuration(totalSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
