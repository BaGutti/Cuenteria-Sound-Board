import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
}

const ioHandler = (req: NextApiRequest, res: ExtendedNextApiResponse) => {
  if (!res.socket.server.io) {
    console.log('Starting Socket.io server...');

    const io = new ServerIO(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      socket.on('playSound', (soundId: string) => {
        console.log(`Playing sound: ${soundId}`);
        socket.broadcast.emit('soundTriggered', soundId);
      });

      socket.on('fadeOut', (duration: number = 2000) => {
        console.log(`Fade out requested with duration: ${duration}ms`);
        socket.broadcast.emit('fadeOutTriggered', duration);
      });

      socket.on('stopAll', () => {
        console.log(`Stop all sounds requested`);
        socket.broadcast.emit('stopAllTriggered');
      });

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
};

export default ioHandler;