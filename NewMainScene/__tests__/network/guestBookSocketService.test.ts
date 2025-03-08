import { GuestBookSocketService } from '../../src/network/guestBookSocketService';
import * as guestBookUI from '../../src/guest_book_ui';
import * as timerUtils from '../../src/utils/timerUtils';

// Mock the guest_book_ui module
jest.mock('../../src/guest_book_ui', () => ({
  setGuestBookEntries: jest.fn(),
  updateGuestBookConnectionState: jest.fn()
}));

// Mock the timerUtils module
jest.mock('../../src/utils/timerUtils', () => ({
  createTimeout: jest.fn().mockReturnValue(123),
  cancelTimeout: jest.fn()
}));

// Mock WebSocket
class MockWebSocket {
  url: string;
  onopen: Function | null = null;
  onmessage: Function | null = null;
  onclose: Function | null = null;
  onerror: Function | null = null;
  readyState: number = WebSocket.OPEN;
  static OPEN: number = 1;
  
  constructor(url: string) {
    this.url = url;
  }
  
  send(message: string): void {}
  close(): void {}
}

// Replace global WebSocket with our mock
global.WebSocket = MockWebSocket as any;

// Spy on console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('GuestBookSocketService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock console methods to avoid cluttering test output
    console.log = jest.fn();
    console.error = jest.fn();
  });
  
  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });
  
  describe('constructor', () => {
    it('should initialize a WebSocket connection with the provided URL', () => {
      const url = 'wss://test-url.com';
      const service = new GuestBookSocketService(url);
      
      // Socket should be created with the given URL
      expect((service as any).socket.url).toBe(url);
      
      // Should log initialization
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook WebSocket initialized'));
    });
    
    it('should set up all event handlers', () => {
      const service = new GuestBookSocketService('wss://test-url.com');
      const socket = (service as any).socket;
      
      expect(typeof socket.onopen).toBe('function');
      expect(typeof socket.onmessage).toBe('function');
      expect(typeof socket.onclose).toBe('function');
      expect(typeof socket.onerror).toBe('function');
    });
  });
  
  describe('event handlers', () => {
    let service: GuestBookSocketService;
    let socket: any;
    
    beforeEach(() => {
      service = new GuestBookSocketService('wss://test-url.com');
      socket = (service as any).socket;
      
      // Mock the getEntries method
      (service as any).getEntries = jest.fn();
    });
    
    it('should handle onopen event', () => {
      socket.onopen();
      
      // Should update connection state
      expect(guestBookUI.updateGuestBookConnectionState).toHaveBeenCalledWith(true);
      
      // Should request initial entries
      expect((service as any).getEntries).toHaveBeenCalled();
      
      // Should log a message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook WebSocket connection established'));
    });
    
    it('should handle onmessage event with entries data', () => {
      const entries = [{ id: 1, name: 'Test', message: 'Hello', timestamp: '2023-01-01' }];
      const messageData = JSON.stringify({ status: 'success', entries });
      
      socket.onmessage({ data: messageData });
      
      // Should update entries in UI
      expect(guestBookUI.setGuestBookEntries).toHaveBeenCalledWith(entries);
      
      // Should log the received message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook received message'), expect.any(Object));
    });
    
    it('should handle onmessage event with single entry data', () => {
      const entry = { id: 1, name: 'Test', message: 'Hello', timestamp: '2023-01-01' };
      const messageData = JSON.stringify({ status: 'success', entry });
      
      socket.onmessage({ data: messageData });
      
      // Should refresh entries list
      expect((service as any).getEntries).toHaveBeenCalled();
      
      // Should log the received message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook received message'), expect.any(Object));
    });
    
    it('should handle onmessage event with error status', () => {
      const messageData = JSON.stringify({ status: 'error', message: 'Test error' });
      
      socket.onmessage({ data: messageData });
      
      // Should log the error
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('GuestBook error'), 'Test error');
    });
    
    it('should handle invalid JSON in onmessage event', () => {
      const invalidData = 'not valid json';
      
      socket.onmessage({ data: invalidData });
      
      // Should log the error
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to parse GuestBook WebSocket message'), expect.any(Error));
    });
    
    it('should handle onclose event', () => {
      socket.onclose();
      
      // Should update connection state
      expect(guestBookUI.updateGuestBookConnectionState).toHaveBeenCalledWith(false);
      
      // Should set up reconnect timeout
      expect(timerUtils.createTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
      
      // Should log a message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook WebSocket connection closed'));
    });
    
    it('should handle onerror event', () => {
      const errorEvent = new Event('error');
      socket.onerror(errorEvent);
      
      // Should log the error
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('GuestBook WebSocket error'), errorEvent);
    });
  });
  
  describe('public methods', () => {
    let service: GuestBookSocketService;
    let socket: any;
    
    beforeEach(() => {
      service = new GuestBookSocketService('wss://test-url.com');
      socket = (service as any).socket;
      socket.send = jest.fn();
    });
    
    describe('getEntries', () => {
      it('should send a get_entries command when socket is open', () => {
        socket.readyState = WebSocket.OPEN;
        
        service.getEntries();
        
        expect(socket.send).toHaveBeenCalledWith(JSON.stringify({
          command: 'get_entries',
          count: undefined
        }));
      });
      
      it('should include count parameter when provided', () => {
        socket.readyState = WebSocket.OPEN;
        const count = 10;
        
        service.getEntries(count);
        
        expect(socket.send).toHaveBeenCalledWith(JSON.stringify({
          command: 'get_entries',
          count
        }));
      });
      
      it('should not send command when socket is not open', () => {
        socket.readyState = WebSocket.OPEN - 1; // Not OPEN
        
        service.getEntries();
        
        expect(socket.send).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook WebSocket is not open'));
      });
    });
    
    describe('addEntry', () => {
      it('should send an add_entry command when socket is open', () => {
        socket.readyState = WebSocket.OPEN;
        const name = 'Test User';
        const message = 'Hello World';
        
        service.addEntry(name, message);
        
        expect(socket.send).toHaveBeenCalledWith(JSON.stringify({
          command: 'add_entry',
          name,
          message
        }));
      });
      
      it('should use "Anonymous" when name is empty', () => {
        socket.readyState = WebSocket.OPEN;
        const name = '';
        const message = 'Hello World';
        
        service.addEntry(name, message);
        
        expect(socket.send).toHaveBeenCalledWith(JSON.stringify({
          command: 'add_entry',
          name: 'Anonymous',
          message
        }));
      });
      
      it('should not send command when socket is not open', () => {
        socket.readyState = WebSocket.OPEN - 1; // Not OPEN
        
        service.addEntry('Test', 'Message');
        
        expect(socket.send).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GuestBook WebSocket is not open'));
      });
    });
    
    describe('close', () => {
      it('should cancel reconnect timeout if it exists', () => {
        // Set a reconnect timeout
        (service as any).reconnectTimeout = 123;
        
        service.close();
        
        expect(timerUtils.cancelTimeout).toHaveBeenCalledWith(123);
      });
      
      it('should close the socket', () => {
        socket.close = jest.fn();
        
        service.close();
        
        expect(socket.close).toHaveBeenCalled();
      });
    });
  });
  
  describe('reconnect', () => {
    it('should create a new WebSocket and set up event handlers', () => {
      const url = 'wss://test-url.com';
      const service = new GuestBookSocketService(url);
      
      // Reset mocks to check if they're called again during reconnect
      jest.clearAllMocks();
      
      // Call the private reconnect method
      (service as any).reconnect();
      
      // Should create a new socket with the original URL
      expect((service as any).socket.url).toBe(url);
      
      // Should log a reconnection attempt
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Attempting to reconnect to GuestBook WebSocket'));
    });
  });
}); 