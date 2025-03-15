interface Message {
  type: string;
  content?: any;
}

type IntervalType = ReturnType<typeof setInterval>;
type TimeoutType = ReturnType<typeof setTimeout>;

class WebSocketService {
  private url: string;
  private ws: WebSocket | null;
  private heartbeatInterval: IntervalType | null;
  private reconnectTimeout: TimeoutType | null;
  private reconnectDelay: number;
  private heartbeatMsg: string;
  private onMessageCallback: ((message: Message) => void) | null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private lastHeartbeatResponse: number = 0;
  private heartbeatTimeout: number = 15000; // 心跳超时时间：15秒
  private isManualClose: boolean = false;
  private pingTimeout: TimeoutType | null = null;
  private debugMode: boolean = true;
  private heartbeatRetries: number = 0;
  private maxHeartbeatRetries: number = 3;

  constructor(url: string) {
    this.url = url;
    this.ws = null;
    this.heartbeatInterval = null;
    this.reconnectTimeout = null;
    this.reconnectDelay = 5000; // 增加重连延迟到5秒
    this.heartbeatMsg = JSON.stringify({ type: 'ping' }); // 心跳消息
    this.onMessageCallback = null;
    this.reconnectAttempts = 0;
    this.lastHeartbeatResponse = Date.now();
    this.isManualClose = false;
    this.heartbeatRetries = 0;
  }

  private log(...args: any[]): void {
    if (this.debugMode) {
      console.log('[WebSocket]', ...args);
    }
  }

  connect(): void {
    if (this.ws) {
      this.ws.close();
    }

    if (this.isManualClose) {
      return;
    }

    try {
      this.log('开始连接到', this.url);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.log('连接成功');
        this.reconnectAttempts = 0;
        this.heartbeatRetries = 0;
        this.lastHeartbeatResponse = Date.now();
        this.startHeartbeat();
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data: Message = JSON.parse(event.data);
          this.log('收到消息:', data);

          if (data.type === 'pong') {
            this.log('收到心跳响应');
            this.lastHeartbeatResponse = Date.now();
            this.heartbeatRetries = 0;
            if (this.pingTimeout) {
              clearTimeout(this.pingTimeout);
              this.pingTimeout = null;
            }
          }

          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        }
        catch (error) {
          this.log('消息解析错误:', error, '原始消息:', event.data);
        }
      };

      this.ws.onerror = (error: Event) => {
        console.error('WebSocket 错误:', error);
        if (!this.isManualClose) {
          this.reconnect();
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        console.log('WebSocket 已关闭，关闭码:', event.code, '原因:', event.reason);
        this.stopHeartbeat();

        if (!this.isManualClose) {
          this.reconnect();
        }
      };
    }
    catch (error) {
      this.log('连接创建失败:', error);
      if (!this.isManualClose) {
        this.reconnect();
      }
    }
  }

  // 设置外部监听回调
  onMessage(callback: (message: Message) => void): void {
    this.onMessageCallback = callback;
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const now = Date.now();
        if (now - this.lastHeartbeatResponse > this.heartbeatTimeout) {
          this.heartbeatRetries++;
          this.log(`心跳重试 ${this.heartbeatRetries}/${this.maxHeartbeatRetries}`);

          if (this.heartbeatRetries >= this.maxHeartbeatRetries) {
            this.log('心跳重试达到最大次数，关闭连接');
            this.ws.close();
            this.heartbeatRetries = 0;
            return;
          }
        }

        // 发送心跳消息
        try {
          this.log('发送心跳消息');
          this.ws.send(this.heartbeatMsg);

          if (this.pingTimeout) {
            clearTimeout(this.pingTimeout);
          }

          this.pingTimeout = setTimeout(() => {
            this.log('心跳响应超时');
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.lastHeartbeatResponse = now; // 重置最后响应时间
              this.heartbeatRetries++;

              if (this.heartbeatRetries >= this.maxHeartbeatRetries) {
                this.log('心跳重试次数过多，重新连接');
                this.ws.close();
                this.heartbeatRetries = 0;
              }
            }
          }, 8000); // 增加单次心跳等待时间到8秒
        }
        catch (error) {
          this.log('发送心跳消息失败:', error);
        }
      }
    }, 10000); // 增加心跳间隔到10秒
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private reconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      console.log(`第 ${this.reconnectAttempts} 次尝试重连...`);
      this.connect();
    }, this.reconnectDelay);
  }

  sendMessage(message: Message): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
    else {
      console.error('WebSocket 未连接');
    }
  }

  close(): void {
    this.isManualClose = true;

    if (this.ws) {
      this.ws.close(1000, '客户端主动关闭');
    }

    this.stopHeartbeat();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
      this.pingTimeout = null;
    }
  }

  // 添加重新开启连接的方法
  reopen(): void {
    this.isManualClose = false;
    this.reconnectAttempts = 0;
    this.connect();
  }
}

export default WebSocketService;
