export class SocketService 
{
    private socket: WebSocket | undefined;

    constructor() 
    {
        this.connect();
    }

    // Connect to the WebSocket server
    private connect(): void 
    {
        this.socket = new WebSocket('wss://localhost:8080/');
    }
  
} 