import { SocketService } from '../../src/network/socketService';
import * as curatorChatUI from '../../src/curator_chat_ui';

// Mock the curator_chat_ui module
jest.mock('../../src/curator_chat_ui', () => ({
  SetSocket: jest.fn(),
  SetCuratorAnswer: jest.fn(),
  SetConnectionState: jest.fn()
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

describe('SocketService', () => {
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
      const service = new SocketService(url);
      
      // Socket should be created with the given URL
      expect((service as any).socket.url).toBe(url);
      
      // SetSocket should be called with the socket
      expect(curatorChatUI.SetSocket).toHaveBeenCalled();
    });
    
    it('should set up all event handlers', () => {
      const service = new SocketService('wss://test-url.com');
      const socket = (service as any).socket;
      
      expect(typeof socket.onopen).toBe('function');
      expect(typeof socket.onmessage).toBe('function');
      expect(typeof socket.onclose).toBe('function');
      expect(typeof socket.onerror).toBe('function');
    });
  });
  
  describe('event handlers', () => {
    let service: SocketService;
    let socket: any;
    
    beforeEach(() => {
      service = new SocketService('wss://test-url.com');
      socket = (service as any).socket;
    });
    
    it('should handle onopen event', () => {
      socket.onopen();
      
      // Should set connection state to true
      expect(curatorChatUI.SetConnectionState).toHaveBeenCalledWith(true);
      
      // Should log a message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('WebSocket is open'));
    });
    
    it('should handle onmessage event', () => {
      const messageData = 'test message';
      socket.onmessage({ data: messageData });
      
      // Should pass the message data to SetCuratorAnswer
      expect(curatorChatUI.SetCuratorAnswer).toHaveBeenCalledWith(messageData);
    });
    
    it('should handle onclose event', () => {
      socket.onclose();
      
      // Should set connection state to false
      expect(curatorChatUI.SetConnectionState).toHaveBeenCalledWith(false);
      
      // Should log a message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('WebSocket is closed'));
      
      // Note: The actual code has a commented-out reconnect attempt
      // If this is uncommented, we'd need to test that behavior
    });
    
    it('should handle onerror event', () => {
      const errorEvent = new Event('error');
      socket.onerror(errorEvent);
      
      // Should log the error
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('WebSocket error'), errorEvent);
    });
  });
  
  describe('sendMessage', () => {
    let service: SocketService;
    let socket: any;
    
    beforeEach(() => {
      service = new SocketService('wss://test-url.com');
      socket = (service as any).socket;
      socket.send = jest.fn();
    });
    
    it('should send a message when the socket is open', () => {
      const message = 'test message';
      socket.readyState = WebSocket.OPEN;
      
      service.sendMessage(message);
      
      expect(socket.send).toHaveBeenCalledWith(message);
    });
    
    it('should not send a message when the socket is not open', () => {
      const message = 'test message';
      socket.readyState = WebSocket.OPEN - 1; // Not OPEN
      
      service.sendMessage(message);
      
      expect(socket.send).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('WebSocket is not open'));
    });
  });
  
  describe('reconnect', () => {
    it('should create a new WebSocket and set up event handlers', () => {
      const url = 'wss://test-url.com';
      const service = new SocketService(url);
      
      // Reset mocks to check if they're called again during reconnect
      jest.clearAllMocks();
      
      // Call the private reconnect method
      (service as any).reconnect();
      
      // Should create a new socket with the original URL
      expect((service as any).socket.url).toBe(url);
      
      // Should update the global socket reference
      expect(curatorChatUI.SetSocket).toHaveBeenCalled();
      
      // Should log a reconnection attempt
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('reconnect'));
    });
  });
}); 