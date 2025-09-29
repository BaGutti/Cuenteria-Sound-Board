import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  } & NextApiResponse['socket'];
}

const ioHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  if (!res.socket.server.io) {
    console.log('Starting Socket.io server...');

    const io = new ServerIO(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      transports: ['polling'], // Force polling only for Vercel compatibility
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      // Increase timeouts for better stability on serverless
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Log all events for debugging
      socket.onAny((eventName) => {
        console.log(`📨 Event: ${eventName} [${socket.id}]`);
      });

      socket.on('playSound', (soundId: string) => {
        console.log(`🎵 Playing sound: ${soundId} [Socket: ${socket.id}]`);
        socket.broadcast.emit('soundTriggered', soundId);
      });

      socket.on('fadeOut', (duration: number = 2000) => {
        console.log(`🎚️ Fade out requested with duration: ${duration}ms [Socket: ${socket.id}]`);
        socket.broadcast.emit('fadeOutTriggered', duration);
      });

      socket.on('stopAll', () => {
        console.log(`⏹️ Stop all sounds requested [Socket: ${socket.id}]`);
        socket.broadcast.emit('stopAllTriggered');
      });

      socket.on('changeStoryMode', (modeId: string) => {
        console.log(`📖 Story mode changed to: ${modeId} [Socket: ${socket.id}]`);
        // Broadcast to all clients including the one that sent it
        io.emit('storyModeChanged', modeId);
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default ioHandler;