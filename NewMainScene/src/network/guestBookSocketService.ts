import { setGuestBookEntries, updateGuestBookConnectionState } from '../guest_book_ui';
import { createTimeout, cancelTimeout } from '../utils/timerUtils';

// Define the structure of a guest book entry
export interface GuestBookEntry {
  id: number;
  name: string;
  message: string;
  timestamp: string;
}

export class GuestBookSocketService {
  private socket: WebSocket;
  private url: string;
  private reconnectTimeout: number | null = null;

  constructor(url: string) {
    this.url = url;
    this.socket = new WebSocket(url);
    this.setupEventHandlers();
    console.log('GuestBook WebSocket initialized');
  }

  // Set up WebSocket event handlers
  private setupEventHandlers(): void {
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onerror = this.onError.bind(this);
  }

  // Handle WebSocket open event
  private onOpen(): void {
    console.log('GuestBook WebSocket connection established');
    updateGuestBookConnectionState(true);
    
    // Request initial entries when connection is established
    this.getEntries();
  }

  // Handle WebSocket messages
  private onMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('GuestBook received message:', data);
      
      if (data.status === 'success') {
        // Handle successful get_entries response
        if (data.entries) {
          setGuestBookEntries(data.entries);
        }
        
        // Handle successful add_entry response
        if (data.entry) {
          // Refresh entries list after adding a new entry
          this.getEntries();
        }
      } else if (data.status === 'error') {
        console.error('GuestBook error:', data.message);
      }
    } catch (error) {
      console.error('Failed to parse GuestBook WebSocket message:', error);
    }
  }

  // Handle WebSocket close event
  private onClose(): void {
    console.log('GuestBook WebSocket connection closed');
    updateGuestBookConnectionState(false);
    
    // Try to reconnect after a delay using our custom timeout utility
    this.reconnectTimeout = createTimeout(() => this.reconnect(), 5000);
  }

  // Handle WebSocket error event
  private onError(event: Event): void {
    console.error('GuestBook WebSocket error:', event);
  }

  // Reconnect to WebSocket server
  private reconnect(): void {
    console.log('Attempting to reconnect to GuestBook WebSocket...');
    this.socket = new WebSocket(this.url);
    this.setupEventHandlers();
  }

  // Request all guest book entries
  public getEntries(count?: number): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      const message = {
        command: 'get_entries',
        count: count
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.log('GuestBook WebSocket is not open');
    }
  }

  // Add a new guest book entry
  public addEntry(name: string, message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      const entry = {
        command: 'add_entry',
        name: name || 'Anonymous',
        message: message
      };
      this.socket.send(JSON.stringify(entry));
    } else {
      console.log('GuestBook WebSocket is not open');
    }
  }

  // Close the WebSocket connection
  public close(): void {
    if (this.reconnectTimeout) {
      cancelTimeout(this.reconnectTimeout);
    }
    this.socket.close();
  }
} 