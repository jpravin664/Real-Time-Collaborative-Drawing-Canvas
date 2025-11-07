# Collaborative Drawing Canvas

A real-time multi-user drawing application where multiple people can draw simultaneously on the same canvas with instant synchronization.

## Features

- **Real-time Drawing**: See other users' drawings as they draw in real-time
- **Drawing Tools**:
  - Brush with adjustable size (1-50px)
  - Eraser tool
  - Color picker with presets
- **User Presence**:
  - See who's online
  - Cursor tracking shows where other users are drawing
  - Each user gets a unique color identifier
- **Clear Canvas**: Global canvas clearing (affects all users)
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 Modules), HTML5 Canvas API
- **Backend**: Node.js, Express, WebSocket (ws library)
- **No frameworks**: Pure JavaScript implementation

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Testing with Multiple Users

To test the collaborative features:

1. Open multiple browser windows/tabs pointing to `http://localhost:3000`
2. Or open the app on different devices on the same network using your local IP
3. Start drawing in one window and see it appear in real-time in others
4. Move your cursor around to see cursor tracking

## Project Structure

```
collaborative-canvas/
├── client/
│   ├── index.html          # Main HTML structure
│   ├── style.css           # Styling and layout
│   ├── canvas.js           # Canvas drawing logic
│   ├── websocket.js        # WebSocket client management
│   └── main.js             # Application initialization
├── server/
│   └── server.js           # Express + WebSocket server
├── package.json
├── README.md
└── ARCHITECTURE.md
```

## Usage

### Drawing Tools

- **Brush**: Click the brush icon or it's active by default
- **Eraser**: Click the eraser icon to switch to eraser mode
- **Size**: Use the slider to adjust brush/eraser size
- **Color**: Click the color picker or use preset colors
- **Clear Canvas**: Click the trash icon (confirms before clearing)

### Controls

- **Mouse**: Click and drag to draw
- **Touch**: Touch and drag on mobile devices
- **Cursor Tracking**: Move your mouse over the canvas to show your position to others

## Known Limitations

1. **No Persistence**: Canvas state is not saved - refresh clears everything
2. **No Undo/Redo**: Global undo/redo not implemented (complex state management)
3. **No Authentication**: Users are assigned random IDs
4. **Single Room**: All users share one canvas (no room separation)
5. **Canvas Resolution**: Fixed canvas size based on viewport

## Performance Notes

- Optimized for low-latency drawing transmission
- Cursor positions throttled to reduce network traffic
- Efficient canvas rendering using native APIs

## Time Spent

Approximately 4-5 hours:
- 1 hour: Project setup and architecture design
- 2 hours: Core canvas and WebSocket implementation
- 1 hour: UI/UX and styling
- 1 hour: Testing and bug fixes


## Future Enhancements

- Canvas state persistence (database/localStorage)
- Global undo/redo functionality
- Room system for isolated canvases
- User authentication
- Drawing shapes (rectangle, circle, line)
- Text tool
- Image upload
- Export canvas as PNG
- Drawing history/replay

## License

MIT
