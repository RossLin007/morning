/**
 * Gamification Business Logic
 *
 * Centralized calculations for XP, levels, and rewards.
 * This separates business logic from UI state management.
 */

/**
 * Calculate level from XP using quadratic curve
 * Formula: Level = floor(sqrt(XP / 100)) + 1
 *
 * XP progression:
 * - 0 XP = Level 1
 * - 100 XP = Level 2
 * - 400 XP = Level 3
 * - 900 XP = Level 4
 * - 1600 XP = Level 5
 */
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculate XP required for the next level
 * Formula: Level^2 * 100
 */
export function calculateNextLevelXp(level: number): number {
  return Math.pow(level, 2) * 100;
}

/**
 * Calculate XP progress percentage for current level
 * Returns a value between 0 and 100
 */
export function calculateLevelProgress(xp: number, level: number): number {
  const currentLevelBaseXp = Math.pow(level - 1, 2) * 100;
  const nextLevelXp = calculateNextLevelXp(level);
  const xpInCurrentLevel = xp - currentLevelBaseXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelBaseXp;

  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));
}

/**
 * Check if adding XP would result in a level up
 */
export function wouldLevelUp(currentXp: number, xpToAdd: number): boolean {
  const newLevel = calculateLevel(currentXp + xpToAdd);
  const currentLevel = calculateLevel(currentXp);
  return newLevel > currentLevel;
}

/**
 * Calculate total XP needed to reach a specific level
 */
export function calculateXpForLevel(targetLevel: number): number {
  return Math.pow(targetLevel - 1, 2) * 100;
}

/**
 * Reward constants
 */
export const REWARDS = {
  // Daily activities
  DAILY_READ: { xp: 10, coins: 5, reason: '完成晨读' },
  DAILY_MEDITATION: { xp: 5, coins: 2, reason: '完成冥想' },
  DAILY_PARTNER_INTERACTION: { xp: 15, coins: 10, reason: '伙伴互动' },

  // Course completion
  LESSON_COMPLETE: { xp: 20, coins: 10, reason: '完成课程' },
  CHAPTER_COMPLETE: { xp: 50, coins: 25, reason: '完成章节' },
  COURSE_COMPLETE: { xp: 200, coins: 100, reason: '完成全部课程' },

  // Social
  POST_CREATE: { xp: 10, coins: 5, reason: '发布动态' },
  COMMENT_POST: { xp: 5, coins: 2, reason: '评论互动' },
  RECEIVE_LIKE: { xp: 2, coins: 1, reason: '获得点赞' },

  // Streaks
  STREAK_DAY_3: { xp: 30, coins: 15, reason: '连续3天' },
  STREAK_DAY_7: { xp: 100, coins: 50, reason: '连续7天' },
  STREAK_DAY_30: { xp: 500, coins: 250, reason: '连续30天' },

  // Partner system
  PARTNER_MATCH: { xp: 25, coins: 10, reason: '匹配伙伴' },
  WATER_PLANT: { xp: 5, coins: 2, reason: '浇水' },
  TREE_LEVEL_UP: { xp: 50, coins: 25, reason: '关系升级' },
} as const;

export type RewardKey = keyof typeof REWARDS;

/**
 * Get reward by key
 */
export function getReward(key: RewardKey) {
  return REWARDS[key];
}
