
import { useState, useEffect, useRef, useCallback } from 'react';

type TimerType = 'countdown' | 'stopwatch';

interface UseTimerProps {
  initialTime?: number; // Seconds
  type?: TimerType;
  onComplete?: () => void;
}

export const useTimer = ({ initialTime = 0, type = 'stopwatch', onComplete }: UseTimerProps = {}) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  
  // Compatible with both browser and node env types for interval
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  
  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setTime(newTime !== undefined ? newTime : initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (type === 'countdown') {
            if (prev <= 1) {
              setIsRunning(false);
              if (onComplete) onComplete();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, type, onComplete]);

  return { time, isRunning, start, pause, reset, setTime };
};
