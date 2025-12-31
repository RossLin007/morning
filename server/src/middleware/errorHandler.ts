/**
 * Global Error Handler Middleware
 * 
 * Catches all errors and returns a standardized response.
 * Hides sensitive error details in production.
 */
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    status?: number;
    code?: string;
}

/**
 * Error handler middleware - must be the last middleware in the chain.
 * 
 * @example
 * // At the end of your Express app setup:
 * app.use(errorHandler);
 */
export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';

    // Log error for debugging
    console.error(`❌ [${code}] ${err.message}`, {
        path: req.path,
        method: req.method,
        status,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    });

    // Hide internal error details in production
    const message = status >= 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(status).json({
        error: {
            code,
            message,
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        },
    });
};

/**
 * Creates an application error with status code and error code.
 * 
 * @example
 * throw createError(404, 'User not found', 'USER_NOT_FOUND');
 */
export const createError = (status: number, message: string, code?: string): AppError => {
    const error: AppError = new Error(message);
    error.status = status;
    error.code = code;
    return error;
};

/**
 * Async handler wrapper to catch errors in async route handlers.
 * 
 * @example
 * router.get("/", asyncHandler(async (req, res) => {
 *   const data = await fetchData();
 *   res.json(data);
 * }));
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
