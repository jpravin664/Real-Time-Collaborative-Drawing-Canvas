import { CanvasManager } from './canvas.js';
import { WebSocketClient } from './websocket.js';

class CollaborativeCanvas {
  constructor() {
    this.canvas = new CanvasManager(document.getElementById('drawingCanvas'));
    this.ws = new WebSocketClient();
    this.cursors = new Map();

    this.initializeUI();
    this.setupWebSocket();
    this.setupCanvasCallbacks();
  }

  initializeUI() {
    const brushTool = document.getElementById('brushTool');
    const eraserTool = document.getElementById('eraserTool');
    const clearCanvas = document.getElementById('clearCanvas');
    const brushSize = document.getElementById('brushSize');
    const sizeValue = document.getElementById('sizeValue');
    const colorPicker = document.getElementById('colorPicker');
    const colorPresets = document.querySelectorAll('.color-preset');

    brushTool.addEventListener('click', () => {
      this.setActiveTool('brush');
      brushTool.classList.add('active');
      eraserTool.classList.remove('active');
    });

    eraserTool.addEventListener('click', () => {
      this.setActiveTool('eraser');
      eraserTool.classList.add('active');
      brushTool.classList.remove('active');
    });

    clearCanvas.addEventListener('click', () => {
      if (confirm('Clear the entire canvas? This will affect all users.')) {
        this.canvas.clear();
        this.ws.sendClearCanvas();
      }
    });

    brushSize.addEventListener('input', (e) => {
      const size = parseInt(e.target.value);
      sizeValue.textContent = size;
      this.canvas.setSize(size);
    });

    colorPicker.addEventListener('input', (e) => {
      this.canvas.setColor(e.target.value);
    });

    colorPresets.forEach(preset => {
      preset.addEventListener('click', () => {
        const color = preset.dataset.color;
        colorPicker.value = color;
        this.canvas.setColor(color);
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (this.ws.connected) {
        const canvas = document.getElementById('drawingCanvas');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          this.ws.sendCursorPosition(x, y);
        }
      }
    });
  }

  setActiveTool(tool) {
    this.canvas.setTool(tool);
  }

  setupWebSocket() {
    this.ws.onInit = (clientId, color) => {
      const userIndicator = document.getElementById('userIndicator');
      userIndicator.textContent = `You (User ${clientId})`;
      userIndicator.style.background = color;
      console.log(`Initialized as User ${clientId} with color ${color}`);
    };

    this.ws.onConnectionChange = (connected) => {
      const status = document.getElementById('connectionStatus');
      if (connected) {
        status.textContent = 'Connected';
        status.className = 'status connected';
      } else {
        status.textContent = 'Disconnected';
        status.className = 'status disconnected';
      }
    };

    this.ws.connect((message) => {
      this.handleWebSocketMessage(message);
    });
  }

  setupCanvasCallbacks() {
    this.canvas.onDraw = (drawData) => {
      this.ws.sendDrawData(drawData);
    };
  }

  handleWebSocketMessage(message) {
    switch (message.type) {
      case 'draw':
        this.canvas.drawRemoteLine(message);
        break;

      case 'cursor':
        this.updateRemoteCursor(message.clientId, message.x, message.y, message.color);
        break;

      case 'clear':
        this.canvas.clear();
        break;

      case 'users':
        this.updateUsersList(message.users);
        break;
    }
  }

  updateRemoteCursor(clientId, x, y, color) {
    const cursorsContainer = document.getElementById('cursors');
    let cursor = this.cursors.get(clientId);

    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'cursor';
      cursor.innerHTML = `<div class="cursor-label">User ${clientId}</div>`;
      cursor.style.background = color;
      cursorsContainer.appendChild(cursor);
      this.cursors.set(clientId, cursor);
    }

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    if (cursor.hideTimeout) {
      clearTimeout(cursor.hideTimeout);
    }

    cursor.style.opacity = '1';
    cursor.hideTimeout = setTimeout(() => {
      cursor.style.opacity = '0';
    }, 2000);
  }

  updateUsersList(users) {
    const usersList = document.getElementById('usersList');
    const onlineUsers = document.getElementById('onlineUsers');

    onlineUsers.textContent = `Users: ${users.length}`;

    usersList.innerHTML = '';

    users.forEach(user => {
      if (user.id !== this.ws.clientId) {
        const badge = document.createElement('div');
        badge.className = 'user-badge';
        badge.innerHTML = `
          <div class="color-dot" style="background: ${user.color}"></div>
          <span>User ${user.id}</span>
        `;
        usersList.appendChild(badge);
      }
    });

    users.forEach(user => {
      if (user.id !== this.ws.clientId && !this.cursors.has(user.id)) {
        const cursorsContainer = document.getElementById('cursors');
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.innerHTML = `<div class="cursor-label">User ${user.id}</div>`;
        cursor.style.background = user.color;
        cursor.style.opacity = '0';
        cursorsContainer.appendChild(cursor);
        this.cursors.set(user.id, cursor);
      }
    });

    this.cursors.forEach((cursor, clientId) => {
      const userExists = users.some(u => u.id === clientId);
      if (!userExists) {
        cursor.remove();
        this.cursors.delete(clientId);
      }
    });
  }
}

new CollaborativeCanvas();
