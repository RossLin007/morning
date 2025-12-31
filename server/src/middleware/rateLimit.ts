/**
 * Rate Limiting Middleware
 * 
 * Provides configurable rate limiting for API endpoints.
 * Uses in-memory store by default (suitable for single-instance deployments).
 */

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

interface RateLimitConfig {
    windowMs: number;     // Time window in milliseconds
    max: number;          // Max requests per window
    message?: string;     // Custom error message
    keyGenerator?: (req: any) => string; // Custom key generator
}

const defaultStore: RateLimitStore = {};

/**
 * Creates a rate limiting middleware.
 * 
 * @example
 * // Limit AI endpoint to 10 requests per minute
 * router.use(rateLimit({ windowMs: 60000, max: 10 }));
 */
export const rateLimit = (config: RateLimitConfig) => {
    const {
        windowMs,
        max,
        message = 'Too many requests, please try again later.',
        keyGenerator = (req) => req.user?.id || req.ip || 'anonymous',
    } = config;

    return (req: any, res: any, next: any) => {
        const key = keyGenerator(req);
        const now = Date.now();

        // Initialize or reset if window expired
        if (!defaultStore[key] || defaultStore[key].resetTime < now) {
            defaultStore[key] = {
                count: 0,
                resetTime: now + windowMs,
            };
        }

        const entry = defaultStore[key];
        entry.count++;

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
        res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

        if (entry.count > max) {
            return res.status(429).json({
                error: 'RATE_LIMIT_EXCEEDED',
                message,
                retryAfter: Math.ceil((entry.resetTime - now) / 1000),
            });
        }

        next();
    };
};

/**
 * Pre-configured rate limiters for common use cases
 */
export const RateLimiters = {
    // Strict: 10 requests per minute (for AI/expensive operations)
    ai: rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        message: 'AI request limit reached. Please wait before trying again.',
    }),

    // Standard: 100 requests per minute
    standard: rateLimit({
        windowMs: 60 * 1000,
        max: 100,
    }),

    // Auth: 5 requests per minute (for login/register)
    auth: rateLimit({
        windowMs: 60 * 1000,
        max: 5,
        message: 'Too many authentication attempts. Please try again later.',
    }),

    // Uploads: 20 per hour
    uploads: rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 20,
        message: 'Upload limit reached. Please try again later.',
    }),
};
