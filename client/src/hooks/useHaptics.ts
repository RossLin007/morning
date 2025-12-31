
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHaptics = () => {
  const trigger = useCallback((type: HapticType = 'light') => {
    // Check user preference from localStorage (default to true)
    const storedPref = localStorage.getItem('mr_setting_sound');
    const isEnabled = storedPref ? JSON.parse(storedPref) : true;

    if (!isEnabled || !navigator.vibrate) return;

    switch (type) {
      case 'light':
        navigator.vibrate(10); // Taptic engine lite feel
        break;
      case 'medium':
        navigator.vibrate(40);
        break;
      case 'heavy':
        navigator.vibrate(70);
        break;
      case 'success':
        navigator.vibrate([30, 50, 30]); // Da-da-da
        break;
      case 'warning':
        navigator.vibrate([100, 50, 100]);
        break;
      case 'error':
        navigator.vibrate([300, 100, 300]);
        break;
      default:
        navigator.vibrate(10);
    }
  }, []);

  return { trigger };
};
