/**
 * Gamification Context
 *
 * Provides global state and actions for XP, coins, levels, and rewards.
 * Optimized to prevent unnecessary re-renders using useMemo and useCallback.
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHaptics } from '@/hooks/useHaptics';
import { useProfile } from '@/hooks/useProfile';
import { api } from '@/lib/api';
import {
  calculateLevel,
  calculateNextLevelXp,
  getReward,
  type RewardKey
} from '@/lib/gamification';

export interface RewardItem {
  amount: number;
  type: 'xp' | 'coin';
  reason: string;
  id: number;
}

export interface LevelUpState {
  oldLv: number;
  newLv: number;
}

interface GamificationState {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  nextLevelXp: number;
  levelProgress: number; // 0-100 percentage
  // UI State exposed for consumers
  rewardQueue: RewardItem[];
  showLevelUp: LevelUpState | null;
  loading: boolean;
}

interface GamificationContextType extends GamificationState {
  addXp: (amount: number, reason?: string) => void;
  addCoins: (amount: number, reason?: string) => void;
  spendCoins: (amount: number) => boolean;
  addReward: (key: RewardKey) => void;
  dismissLevelUp: () => void;
}

const GamificationContext = createContext<GamificationContextType>({
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  nextLevelXp: 100,
  levelProgress: 0,
  rewardQueue: [],
  showLevelUp: null,
  loading: true,
  addXp: () => {},
  addCoins: () => {},
  spendCoins: () => false,
  addReward: () => {},
  dismissLevelUp: () => {}
});

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { trigger: haptic } = useHaptics();
  const { profile, isLoading: profileLoading } = useProfile();

  // Local state for immediate UI feedback (Optimistic)
  const [localXp, setLocalXp] = useState(0);
  const [localCoins, setLocalCoins] = useState(0);
  const [localStreak, setLocalStreak] = useState(1);

  // Sync local state when remote profile loads
  useEffect(() => {
    if (profile) {
      setLocalXp(profile.xp || 0);
      setLocalCoins(profile.coins || 0);
      setLocalStreak(profile.streak || 1);
    }
  }, [profile]);

  // Derived State
  const level = useMemo(() => calculateLevel(localXp), [localXp]);
  const nextLevelXp = useMemo(() => calculateNextLevelXp(level), [level]);
  const levelProgress = useMemo(() => {
    const currentLevelBaseXp = Math.pow(level - 1, 2) * 100;
    const xpInCurrentLevel = localXp - currentLevelBaseXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelBaseXp;
    return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));
  }, [localXp, level, nextLevelXp]);

  // UI Overlay State
  const [rewardQueue, setRewardQueue] = useState<RewardItem[]>([]);
  const [showLevelUp, setShowLevelUp] = useState<LevelUpState | null>(null);

  // Track previous level for level-up detection
  const prevLevelRef = useRef(level);
  useEffect(() => {
    if (level > prevLevelRef.current) {
      setShowLevelUp({ oldLv: prevLevelRef.current, newLv: level });
      haptic('success');
    }
    prevLevelRef.current = level;
  }, [level, haptic]);

  const addXp = useCallback(async (amount: number, reason: string = '获得经验') => {
    setLocalXp(prev => prev + amount);
    triggerReward(amount, 'xp', reason, setRewardQueue, haptic);
    // Background Sync
    try { await api.profile.addReward(amount, 0); } catch (e) { console.error('XP Sync failed', e); }
  }, [haptic]);

  const addCoins = useCallback(async (amount: number, reason: string = '获得 Zen Coin') => {
    setLocalCoins(prev => prev + amount);
    triggerReward(amount, 'coin', reason, setRewardQueue, haptic);
    // Background Sync
    try { await api.profile.addReward(0, amount); } catch (e) { console.error('Coins Sync failed', e); }
  }, [haptic]);

  const spendCoins = useCallback((amount: number): boolean => {
    if (localCoins >= amount) {
        setLocalCoins(prev => prev - amount);
        // Background Sync (Negative reward)
        api.profile.addReward(0, -amount).catch(e => console.error('Spend Sync failed', e));
        return true;
    }
    return false;
  }, [localCoins]);

  const addReward = useCallback((key: RewardKey) => {
    const reward = getReward(key);
    if (reward.xp > 0) addXp(reward.xp, reward.reason);
    if (reward.coins > 0) addCoins(reward.coins, reward.reason);
  }, [addXp, addCoins]);

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(null);
  }, []);

  const contextValue = useMemo<GamificationContextType>(() => ({
    xp: localXp,
    coins: localCoins,
    level,
    streak: localStreak,
    nextLevelXp,
    levelProgress,
    rewardQueue,
    showLevelUp,
    loading: profileLoading,
    addXp,
    addCoins,
    spendCoins,
    addReward,
    dismissLevelUp
  }), [
    localXp,
    localCoins,
    level,
    localStreak,
    nextLevelXp,
    levelProgress,
    rewardQueue,
    showLevelUp,
    profileLoading,
    addXp,
    addCoins,
    spendCoins,
    addReward,
    dismissLevelUp
  ]);

  return (
    <GamificationContext.Provider value={contextValue}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => useContext(GamificationContext);

// Helper function (extracted to avoid recreating on every render)
function triggerReward(
  amount: number,
  type: 'xp' | 'coin',
  reason: string,
  setRewardQueue: React.Dispatch<React.SetStateAction<RewardItem[]>>,
  haptic: (type: 'light' | 'medium' | 'success' | 'warning' | 'error') => void
) {
  const id = Date.now();
  setRewardQueue(prev => [...prev, { amount, type, reason, id }]);
  haptic('medium');
  // Auto dismiss after 3s
  setTimeout(() => {
    setRewardQueue(prev => prev.filter(item => item.id !== id));
  }, 3000);
}
