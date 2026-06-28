import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketHookOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = (url: string | null, options: WebSocketHookOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      options.onOpen?.();
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      options.onMessage?.(data);
    };

    socket.onclose = () => {
      setIsConnected(false);
      options.onClose?.();
      
      if (options.reconnect) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, options.reconnectInterval || 5000);
      }
    };

    socket.onerror = (error) => {
      options.onError?.(error);
    };
  }, [url, options]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, sendMessage };
};
