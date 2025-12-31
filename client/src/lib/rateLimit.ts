/**
 * Rate Limiting Utility
 *
 * Provides client-side rate limiting for API calls to prevent abuse
 * and reduce server load. Uses a sliding window algorithm.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request should be allowed
   * @param key - Unique identifier for the request type (e.g., 'ai-chat', 'api-call')
   * @returns true if request is allowed, false if rate limit exceeded
   */
  check(key: string): boolean {
    const now = Date.now();
    const entry = this.requests.get(key);

    // No previous requests or window expired
    if (!entry || now - entry.windowStart > this.config.windowMs) {
      this.requests.set(key, { count: 1, windowStart: now });
      return true;
    }

    // Within window, check count
    if (entry.count < this.config.maxRequests) {
      entry.count++;
      return true;
    }

    // Rate limit exceeded
    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const entry = this.requests.get(key);
    const now = Date.now();

    if (!entry || now - entry.windowStart > this.config.windowMs) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - entry.count);
  }

  /**
   * Get time until reset in milliseconds
   */
  getResetTime(key: string): number {
    const entry = this.requests.get(key);
    if (!entry) return 0;

    const elapsed = Date.now() - entry.windowStart;
    return Math.max(0, this.config.windowMs - elapsed);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Clear all rate limit entries
   */
  clear(): void {
    this.requests.clear();
  }
}

/**
 * Predefined rate limiters for different use cases
 */

// AI Chat: 10 requests per minute (for costly AI operations)
export const aiChatRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

// General API: 30 requests per minute
export const apiRateLimiter = new RateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
});

// Write operations: 5 requests per minute
export const writeRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
});

// Community posts: 3 posts per 5 minutes
export const postRateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 5 * 60 * 1000, // 5 minutes
});

/**
 * Rate limit error class
 */
export class RateLimitError extends Error {
  constructor(
    public readonly resetTime: number,
    message = 'Rate limit exceeded. Please try again later.'
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Helper function to check rate limit and throw error if exceeded
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string,
  customMessage?: string
): void {
  if (!limiter.check(key)) {
    throw new RateLimitError(
      limiter.getResetTime(key),
      customMessage || `Rate limit exceeded. Reset in ${Math.ceil(limiter.getResetTime(key) / 1000)}s.`
    );
  }
}
