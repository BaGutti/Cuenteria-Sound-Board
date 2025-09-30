const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    allowEIO3: true,
    connectTimeout: 45000,
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.onAny((eventName) => {
      console.log(`📨 Event: ${eventName} [${socket.id}]`);
    });

    socket.on('playSound', (soundId) => {
      console.log(`🎵 Playing sound: ${soundId} [Socket: ${socket.id}]`);
      socket.broadcast.emit('soundTriggered', soundId);
    });

    socket.on('fadeOut', (duration = 2000) => {
      console.log(`🎚️ Fade out requested with duration: ${duration}ms [Socket: ${socket.id}]`);
      socket.broadcast.emit('fadeOutTriggered', duration);
    });

    socket.on('stopAll', () => {
      console.log(`⏹️ Stop all sounds requested [Socket: ${socket.id}]`);
      socket.broadcast.emit('stopAllTriggered');
    });

    socket.on('changeStoryMode', (modeId) => {
      console.log(`📖 Story mode changed to: ${modeId} [Socket: ${socket.id}]`);
      io.emit('storyModeChanged', modeId);
      socket.emit('storyModeChanged', modeId);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  server
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
