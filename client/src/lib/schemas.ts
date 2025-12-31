
import { z } from 'zod';

// --- Core Database Schemas ---

// Profile Schema
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  level: z.number().default(1),
  xp: z.number().default(0),
  coins: z.number().default(0),
  updated_at: z.string().nullable().optional(),
});

// Comment Schema
export const CommentSchema = z.object({
  id: z.string(),
  post_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  created_at: z.string(),
  profiles: ProfileSchema.pick({ name: true, avatar: true }).nullable().optional(),
});

// Post Schema (Complex Join)
export const PostSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  content: z.string(),
  image_url: z.string().nullable().optional(),
  created_at: z.string(),
  // Joins
  profiles: ProfileSchema.pick({ name: true, avatar: true, level: true }).nullable().optional(),
  post_likes: z.array(z.object({ user_id: z.string() })).nullable().optional(),
  comments: z.array(z.object({ id: z.string() })).nullable().optional(),
  comments_count: z.number().optional().nullable(),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type PostData = z.infer<typeof PostSchema>;
export type CommentData = z.infer<typeof CommentSchema>;
