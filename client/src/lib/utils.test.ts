
import { describe, it, expect } from 'vitest';
import { formatDuration, cn } from './utils';

describe('utils', () => {
  describe('formatDuration', () => {
    it('formats 0 seconds correctly', () => {
      expect(formatDuration(0)).toBe('00:00');
    });

    it('formats minutes and seconds correctly', () => {
      expect(formatDuration(65)).toBe('01:05');
    });

    it('pads single digits with zero', () => {
      expect(formatDuration(9)).toBe('00:09');
    });

    it('handles large numbers', () => {
      expect(formatDuration(3665)).toBe('61:05');
    });
  });

  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
      const condition = true;
      expect(cn('class1', condition && 'class2', !condition && 'class3')).toBe('class1 class2');
    });

    it('resolves tailwind conflicts', () => {
      // Assuming mock twMerge behavior or checking functionality
      expect(cn('p-4', 'p-2')).toBe('p-2'); 
    });
  });
});
