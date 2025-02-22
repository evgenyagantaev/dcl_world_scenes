import { SetSocket, SetCuratorAnswer, SetConnectionState } from '../curator_chat_ui'

export class SocketService {
  private socket: WebSocket;
  private url: string; // Храним URL для повторных подключений
  private reconnectTimeout: any = null; // Переменная для хранения идентификатора таймера

  constructor(url: string) {
    this.url = url; // Сохраняем URL
    this.socket = new WebSocket(url); // Инициализируем WebSocket
    SetSocket(this.socket); // Устанавливаем глобальную переменную socket
    this.setupEventHandlers(); // Настраиваем обработчики событий
    console.log('WebSocket initialized\n');
  }

  // Метод для настройки обработчиков событий
  private setupEventHandlers(): void {
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
    this.socket.onerror = this.onError.bind(this); // Добавляем обработку ошибок
  }

  // Обработчик открытия соединения
  private onOpen(): void {
    console.log('WebSocket is open\n');
    SetConnectionState(true); // Устанавливаем флаг подключения в true
  }

  // Обработчик получения сообщений
  private onMessage(event: MessageEvent): void {
    SetCuratorAnswer(event.data); // Передаем полученное сообщение в UI
  }

  // Обработчик закрытия соединения
  private onClose(): void {
    console.log('WebSocket is closed\n');
    SetConnectionState(false); // Устанавливаем флаг подключения в false
    // Запускаем попытку переподключения через 2 секунды
    //this.reconnectTimeout = setTimeout(() => this.reconnect(), 2000);
  }

  // Обработчик ошибок
  private onError(event: Event): void {
    console.error('WebSocket error:', event); // Логируем ошибки для отладки
    // Примечание: после onerror обычно следует onclose, так что дополнительной логики не требуется
  }

  // Метод для попытки переподключения
  private reconnect(): void {
    console.log('Attempting to reconnect...\n');
    this.socket = new WebSocket(this.url); // Создаем новый WebSocket
    SetSocket(this.socket); // Обновляем глобальную переменную socket
    this.setupEventHandlers(); // Устанавливаем обработчики событий для нового сокета
  }

  // Метод для отправки сообщений
  public sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('WebSocket is not open');
    }
  }
}