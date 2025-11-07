export class WebSocketClient {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.clientId = null;
    this.clientColor = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 2000;
  }

  connect(onMessage) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.connected = true;
      this.reconnectAttempts = 0;

      if (this.onConnectionChange) {
        this.onConnectionChange(true);
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'init') {
          this.clientId = message.clientId;
          this.clientColor = message.color;

          if (this.onInit) {
            this.onInit(message.clientId, message.color);
          }
        }

        if (onMessage) {
          onMessage(message);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.connected = false;

      if (this.onConnectionChange) {
        this.onConnectionChange(false);
      }

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.connect(onMessage), this.reconnectDelay);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  sendDrawData(drawData) {
    this.send({
      type: 'draw',
      ...drawData
    });
  }

  sendCursorPosition(x, y) {
    this.send({
      type: 'cursor',
      x: x,
      y: y
    });
  }

  sendClearCanvas() {
    this.send({
      type: 'clear'
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
