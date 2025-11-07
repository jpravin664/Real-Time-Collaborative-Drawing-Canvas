# Real-Time Collaborative Canvas Architecture

## Project Overview

This project implements a real-time collaborative drawing canvas application where multiple users can draw simultaneously on a shared canvas. Users can see each other's cursors in real-time, choose different colors and brush sizes, use an eraser tool, and clear the entire canvas. The application uses WebSockets for instant communication between clients and the server.

## Architecture Overview

The application follows a client-server architecture with real-time communication via WebSockets. The server manages client connections and broadcasts drawing events to all connected users. The client-side application provides an interactive canvas interface with drawing tools and real-time synchronization.

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Client 1      │◄──────────────►│                 │
│   (Browser)     │                │   Server        │
│                 │◄──────────────►│   (Node.js)     │
└─────────────────┘                │                 │
                                   └─────────────────┘
┌─────────────────┐                ┌─────────────────┐
│   Client 2      │◄──────────────►│   Client N      │
│   (Browser)     │◄──────────────►│   (Browser)     │
└─────────────────┘                └─────────────────┘
```

## Components

### Server Components

**server/server.js**
- **Purpose**: Main server application handling HTTP requests and WebSocket connections.
- **Responsibilities**:
  - Serve static client files via Express
  - Manage WebSocket connections with WebSocketServer
  - Assign unique IDs and colors to clients
  - Broadcast drawing data, cursor positions, user lists, and clear commands
  - Handle client disconnections and update user lists
- **Key Features**:
  - Client connection management with Map data structure
  - Color assignment from predefined palette
  - Message broadcasting excluding sender

### Client Components

**client/index.html**
- **Purpose**: Main HTML structure for the application UI.
- **Features**: Header with user info, toolbar with drawing tools, canvas container, user list.

**client/main.js**
- **Purpose**: Main application orchestrator.
- **Responsibilities**:
  - Initialize CanvasManager and WebSocketClient
  - Set up UI event listeners for tools, colors, sizes
  - Handle WebSocket messages and update UI accordingly
  - Manage remote cursors and user list display
- **Key Classes**: CollaborativeCanvas

**client/canvas.js**
- **Purpose**: Canvas drawing management.
- **Responsibilities**:
  - Handle mouse/touch events for drawing
  - Render lines on canvas with different tools (brush/eraser)
  - Manage canvas resizing and coordinate mapping
  - Provide drawing callbacks for WebSocket transmission
- **Key Class**: CanvasManager

**client/websocket.js**
- **Purpose**: WebSocket communication client.
- **Responsibilities**:
  - Establish and maintain WebSocket connection
  - Handle connection lifecycle (connect, disconnect, reconnect)
  - Send drawing data, cursor positions, and clear commands
  - Receive and parse server messages
- **Key Class**: WebSocketClient

**client/style.css**
- **Purpose**: Application styling.
- **Features**: Responsive design, gradient backgrounds, tool styling, cursor indicators.

## Data Flow

### Connection Establishment
1. Client connects to server via WebSocket
2. Server assigns client ID and color
3. Server sends initialization message with client info
4. Server broadcasts updated user list to all clients

### Drawing Flow
1. User draws on canvas (mouse/touch events)
2. CanvasManager captures drawing data (coordinates, tool, color, size)
3. Drawing data sent to server via WebSocket
4. Server broadcasts drawing data to all other clients
5. Receiving clients render the drawing on their canvas

### Cursor Tracking
1. Client sends cursor position on mouse move (when over canvas)
2. Server broadcasts cursor position with client ID and color
3. Other clients update remote cursor positions

### Canvas Clearing
1. User clicks clear button (with confirmation)
2. Clear command sent to server
3. Server broadcasts clear command to all clients
4. All clients clear their canvas

## Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework for serving static files
- **WebSocket (ws library)**: Real-time bidirectional communication
- **ES6 Modules**: Modern JavaScript module system

### Frontend
- **HTML5**: Structure and Canvas API
- **CSS3**: Styling with gradients, flexbox, and responsive design
- **JavaScript ES6**: Client-side logic with classes and modules
- **WebSocket API**: Browser WebSocket client

### Development Tools
- **npm**: Package management
- **nodemon**: Development server with auto-restart

## Deployment

### Local Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev` or `node server/server.js`
3. Open browser to `http://localhost:3000`

### Production Deployment
1. Set `NODE_ENV=production`
2. Configure appropriate port via `PORT` environment variable
3. Use process manager like PM2 for production
4. Ensure WebSocket connections are allowed through firewalls/proxies

### Requirements
- Node.js 14+
- Modern browser with WebSocket and Canvas support
- Network connectivity for real-time features

## Scalability Considerations

- **Current Limitations**: Single server instance, in-memory client storage
- **Potential Improvements**:
  - Database for persistent canvas state
  - Redis for distributed client state management
  - Load balancer for multiple server instances
  - Message queuing for high-traffic scenarios
  - Canvas state synchronization for late-joining users
