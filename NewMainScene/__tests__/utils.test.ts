import { getRandomHexColor } from '../src/utils';

describe('Utils', () => {
  describe('getRandomHexColor', () => {
    it('should return a string starting with #', () => {
      const color = getRandomHexColor();
      expect(color.charAt(0)).toBe('#');
    });

    it('should return a 7-character string (# plus 6 hex digits)', () => {
      const color = getRandomHexColor();
      expect(color.length).toBe(7);
    });

    it('should return a valid hex color format', () => {
      const color = getRandomHexColor();
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('should return different values on multiple calls', () => {
      // This test is probabilistic but will be reliable enough
      const iterations = 5;
      const colors = new Set();
      
      for (let i = 0; i < iterations; i++) {
        colors.add(getRandomHexColor());
      }
      
      // If the function is truly random, it's highly unlikely to get
      // the same color multiple times in just a few iterations
      expect(colors.size).toBeGreaterThan(1);
    });
  });
}); 