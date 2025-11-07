export class CanvasManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.isDrawing = false;
    this.currentTool = 'brush';
    this.currentColor = '#000000';
    this.currentSize = 3;
    this.lastX = 0;
    this.lastY = 0;

    this.setupCanvas();
    this.setupEventListeners();
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDrawing());
    this.canvas.addEventListener('mouseout', () => this.stopDrawing());

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas.dispatchEvent(mouseEvent);
    });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const mouseEvent = new MouseEvent('mouseup', {});
      this.canvas.dispatchEvent(mouseEvent);
    });
  }

  getCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  startDrawing(e) {
    this.isDrawing = true;
    const coords = this.getCoordinates(e);
    this.lastX = coords.x;
    this.lastY = coords.y;

    if (this.onDrawStart) {
      this.onDrawStart({
        x: coords.x,
        y: coords.y,
        tool: this.currentTool,
        color: this.currentColor,
        size: this.currentSize
      });
    }
  }

  draw(e) {
    if (!this.isDrawing) return;

    const coords = this.getCoordinates(e);

    this.drawLine(
      this.lastX,
      this.lastY,
      coords.x,
      coords.y,
      this.currentColor,
      this.currentSize,
      this.currentTool
    );

    if (this.onDraw) {
      this.onDraw({
        x0: this.lastX,
        y0: this.lastY,
        x1: coords.x,
        y1: coords.y,
        tool: this.currentTool,
        color: this.currentColor,
        size: this.currentSize
      });
    }

    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  stopDrawing() {
    if (this.isDrawing && this.onDrawEnd) {
      this.onDrawEnd();
    }
    this.isDrawing = false;
  }

  drawLine(x0, y0, x1, y1, color, size, tool) {
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);

    if (tool === 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = 'rgba(0,0,0,1)';
      this.ctx.lineWidth = size;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = size;
    }

    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawRemoteLine(data) {
    this.drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size, data.tool);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setTool(tool) {
    this.currentTool = tool;
  }

  setColor(color) {
    this.currentColor = color;
  }

  setSize(size) {
    this.currentSize = size;
  }
}
