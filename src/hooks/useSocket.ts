import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Use environment variable for socket URL in production
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || url;
    
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket);
    });

    newSocket.on('joinRoom', (room: string) => {
      console.log('Joined room:', room);
    });

    newSocket.on('sendMessage', (message: string) => {
      console.log('Sent message:', message);
      newSocket.emit('receiveMessage', message);
    });

    newSocket.on('receiveMessage', (message: string) => { 
      console.log('Received message:', message);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [url]);

  return socket;
};