/**
 * Request Validation Middleware
 * 
 * Uses Zod schemas to validate request body, params, and query.
 */
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';

interface ValidationSchemas {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}

/**
 * Creates a validation middleware for the specified schemas.
 * 
 * @example
 * const CreatePostSchema = z.object({
 *   content: z.string().min(1).max(500),
 *   image_url: z.string().url().optional(),
 * });
 * 
 * router.post("/", validate({ body: CreatePostSchema }), handler);
 */
export const validate = (schemas: ValidationSchemas) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params) as any;
            }
            if (schemas.query) {
                req.query = schemas.query.parse(req.query) as any;
            }
            next();
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                }));

                return res.status(400).json({
                    error: 'Validation failed',
                    details: formattedErrors,
                });
            }
            next(error);
        }
    };
};

/**
 * Common validation schemas for reuse
 */
export const CommonSchemas = {
    // UUID parameter
    UuidParam: z.object({
        id: z.string().uuid('Invalid ID format'),
    }),

    // Pagination query params
    Pagination: z.object({
        from: z.coerce.number().int().min(0).default(0),
        to: z.coerce.number().int().min(0).default(20),
    }),

    // Profile update
    ProfileUpdate: z.object({
        name: z.string().min(1).max(50).optional(),
        bio: z.string().max(500).optional(),
        avatar: z.string().url().optional(),
    }),
};
