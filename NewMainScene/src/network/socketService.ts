import { SetSocket, SetCuratorAnswer } from '../ui1'

export class SocketService {
  private socket: WebSocket

  constructor(url: string) {
    // Initialize the WebSocket connection
    this.socket = new WebSocket(url)

    // Set the socket externally if needed
    SetSocket(this.socket)

    // Assign event handlers
    this.socket.onopen = this.onOpen.bind(this)
    this.socket.onmessage = this.onMessage.bind(this)
    this.socket.onclose = this.onClose.bind(this)

    console.log('WebSocket initialized\n')
  }

  // Handle WebSocket open event
  private onOpen(): void {
    console.log('WebSocket is open\n')
  }

  // Handle WebSocket message event
  private onMessage(event: MessageEvent): void {
    SetCuratorAnswer(event.data)
  }

  // Handle WebSocket close event
  private onClose(): void {
    console.log('WebSocket is closed\n')
  }

  // Optionally, add a method to send messages over the socket
  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message)
    } else {
      console.log('WebSocket is not open')
    }
  }
} 