
import { describe, it, expect } from 'vitest';
import { ProfileSchema, PostSchema } from './schemas';

describe('Schemas', () => {
  describe('ProfileSchema', () => {
    it('validates a correct profile object', () => {
      const validProfile = {
        id: 'user_123',
        level: 1,
        xp: 0,
        coins: 0,
        name: 'Test User',
        avatar: 'http://example.com/avatar.png'
      };
      const result = ProfileSchema.safeParse(validProfile);
      expect(result.success).toBe(true);
    });

    it('allows null/optional fields', () => {
      const minimalProfile = {
        id: 'user_456',
        level: 1,
        xp: 0,
        coins: 0
      };
      const result = ProfileSchema.safeParse(minimalProfile);
      expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
      const invalidProfile = {
        name: 'No ID'
      };
      const result = ProfileSchema.safeParse(invalidProfile);
      expect(result.success).toBe(false);
    });
  });

  describe('PostSchema', () => {
    it('validates a complete post object', () => {
      const validPost = {
        id: 'post_1',
        user_id: 'user_1',
        content: 'Hello World',
        created_at: new Date().toISOString(),
        profiles: {
          name: 'Author',
          avatar: 'http://avatar.com',
          level: 5
        },
        comments_count: 0
      };
      const result = PostSchema.safeParse(validPost);
      expect(result.success).toBe(true);
    });
  });
});
