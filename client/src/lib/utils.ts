
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

/**
 * Merge tailwind classes with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format seconds into MM:SS format
 */
export const formatDuration = (totalSeconds: number): string => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Safe relative time formatting with Chinese locale
 * Handles 'any' casting internally to keep consumer code clean
 */
export const formatRelativeTime = (date: string | number | Date): string => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: zhCN as any // Centralized 'any' cast for locale compatibility
    });
  } catch (e) {
    return '';
  }
};

/**
 * Simple delay promise for mocking async operations
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
