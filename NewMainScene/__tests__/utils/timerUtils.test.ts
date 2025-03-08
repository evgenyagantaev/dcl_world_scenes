import { createTimeout, cancelTimeout } from '../../src/utils/timerUtils';
import { engine } from '@dcl/sdk/ecs';

// Mock the engine module
jest.mock('@dcl/sdk/ecs', () => {
  const mockEngine = {
    addSystem: jest.fn(),
    PlayerEntity: 'mock-player-entity'
  };
  return { engine: mockEngine };
});

describe('Timer Utilities', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('createTimeout', () => {
    it('should return a timer ID', () => {
      const callback = jest.fn();
      const timerId = createTimeout(callback, 1000);
      
      expect(typeof timerId).toBe('number');
      expect(timerId).toBeGreaterThan(0);
    });

    it('should not throw when creating a timeout', () => {
      const callback = jest.fn();
      expect(() => createTimeout(callback, 1000)).not.toThrow();
    });

    it('should return unique timer IDs for each call', () => {
      const callback = jest.fn();
      const timerId1 = createTimeout(callback, 1000);
      const timerId2 = createTimeout(callback, 2000);
      
      expect(timerId1).not.toBe(timerId2);
    });
  });

  describe('cancelTimeout', () => {
    it('should cancel a timeout without error', () => {
      const callback = jest.fn();
      const timerId = createTimeout(callback, 1000);
      
      // This should not throw an error
      expect(() => cancelTimeout(timerId)).not.toThrow();
    });

    it('should handle canceling a non-existent timer without error', () => {
      // This should not throw an error
      expect(() => cancelTimeout(9999)).not.toThrow();
    });
  });
}); 