import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, '../client')));

const clients = new Map();
let clientIdCounter = 0;

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

wss.on('connection', (ws) => {
  const clientId = clientIdCounter++;
  const clientColor = colors[clientId % colors.length];

  const clientInfo = {
    id: clientId,
    color: clientColor,
    ws: ws
  };

  clients.set(clientId, clientInfo);

  console.log(`Client ${clientId} connected. Total clients: ${clients.size}`);

  ws.send(JSON.stringify({
    type: 'init',
    clientId: clientId,
    color: clientColor
  }));

  const userList = Array.from(clients.values()).map(c => ({
    id: c.id,
    color: c.color
  }));

  broadcast({
    type: 'users',
    users: userList
  }, null);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      message.clientId = clientId;
      message.color = clientColor;

      broadcast(message, clientId);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected. Total clients: ${clients.size}`);

    const userList = Array.from(clients.values()).map(c => ({
      id: c.id,
      color: c.color
    }));

    broadcast({
      type: 'users',
      users: userList
    }, null);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});

function broadcast(message, excludeClientId) {
  const messageStr = JSON.stringify(message);

  clients.forEach((client) => {
    if (client.id !== excludeClientId && client.ws.readyState === 1) {
      client.ws.send(messageStr);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server is ready`);
});
