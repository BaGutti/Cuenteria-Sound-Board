'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    // Use the current host for socket connection
    const socketUrl = typeof window !== 'undefined' ?
      `${window.location.protocol}//${window.location.host}` :
      '';

    const socketInstance = io(socketUrl, {
      path: '/api/socketio',
      transports: ['websocket', 'polling'], // Try websocket first
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      forceNew: false,
      upgrade: true, // Allow upgrading from polling to websocket
      rememberUpgrade: true,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setConnectionAttempts(0);
      console.log('✅ Connected to server');
    });

    socketInstance.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('❌ Disconnected from server:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      setConnectionAttempts(prev => prev + 1);
      console.log('🔄 Connection error:', error.message);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt #${attemptNumber}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const emitSound = useCallback((soundId: string) => {
    if (socket && isConnected) {
      socket.emit('playSound', soundId);
      console.log(`🎵 Emitted sound: ${soundId} [Client Socket: ${socket.id}]`);
    } else {
      console.warn('⚠️ Cannot emit sound - socket not connected');
    }
  }, [socket, isConnected]);

  const emitFadeOut = useCallback((duration: number = 2000) => {
    console.log(`🎚️ EMIT FUNCTION CALLED: emitFadeOut with duration ${duration}ms`);
    console.log(`🔌 Socket status: connected=${isConnected}, socket=${!!socket}`);
    if (socket && isConnected) {
      socket.emit('fadeOut', duration);
      console.log(`🎚️ ✅ Successfully emitted fade out: ${duration}ms [Client Socket: ${socket.id}]`);
    } else {
      console.warn('⚠️ Cannot emit fade out - socket not connected', {socket: !!socket, isConnected});
    }
  }, [socket, isConnected]);

  const emitStopAll = useCallback(() => {
    console.log(`⏹️ EMIT FUNCTION CALLED: emitStopAll`);
    console.log(`🔌 Socket status: connected=${isConnected}, socket=${!!socket}`);
    if (socket && isConnected) {
      socket.emit('stopAll');
      console.log(`⏹️ ✅ Successfully emitted stop all [Client Socket: ${socket.id}]`);
    } else {
      console.warn('⚠️ Cannot emit stop all - socket not connected', {socket: !!socket, isConnected});
    }
  }, [socket, isConnected]);

  return {
    socket,
    isConnected,
    connectionAttempts,
    emitSound,
    emitFadeOut,
    emitStopAll,
  };
}