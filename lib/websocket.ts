// ========================================================================
// WebSocket Client for Real-time Notifications
// ========================================================================

import { useEffect, useRef, useCallback, useState } from 'react';

interface Notification {
  type: string;
  task_id: number;
  task_title: string;
  reminder_type: string;
  message: string;
  due_date?: string;
  timestamp?: string;
}

interface UseWebSocketOptions {
  userId: string;
  onNotification?: (notification: Notification) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  notifications: Notification[];
  clearNotifications: () => void;
  sendMessage: (message: string) => void;
  reconnect: () => void;
}

export function useWebSocket({
  userId,
  onNotification,
  onConnect,
  onDisconnect,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!userId) return;

    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${window.location.host}`;
    const wsUrl = `${host}/ws/${userId}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'pong') {
            // Heartbeat response
            return;
          }

          const notification: Notification = {
            type: data.type || 'reminder',
            task_id: data.task_id,
            task_title: data.task_title,
            reminder_type: data.reminder_type,
            message: data.message,
            due_date: data.due_date,
            timestamp: data.timestamp || new Date().toISOString(),
          };

          setNotifications((prev) => [notification, ...prev].slice(0, 50));
          onNotification?.(notification);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        onDisconnect?.();

        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };
    } catch (e) {
      console.error('Failed to create WebSocket connection:', e);
    }
  }, [userId, onNotification, onConnect, onDisconnect, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    notifications,
    clearNotifications,
    sendMessage,
    reconnect,
  };
}

// ========================================================================
// Notification Toast Component Hook
// ========================================================================

export function useNotificationToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    notification: Notification;
  }>>([]);

  const showToast = useCallback((notification: Notification) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, notification }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
}

// ========================================================================
// Notification Badge Component Helper
// ========================================================================

export function getNotificationIcon(reminderType: string): string {
  const icons: Record<string, string> = {
    due_soon: '⏰',
    due_now: '🔔',
    overdue: '⚠️',
    recurring: '🔄',
  };
  return icons[reminderType] || '📌';
}

export function getNotificationColor(reminderType: string): string {
  const colors: Record<string, string> = {
    due_soon: 'bg-blue-50 border-blue-200 text-blue-700',
    due_now: 'bg-orange-50 border-orange-200 text-orange-700',
    overdue: 'bg-red-50 border-red-200 text-red-700',
    recurring: 'bg-purple-50 border-purple-200 text-purple-700',
  };
  return colors[reminderType] || 'bg-gray-50 border-gray-200 text-gray-700';
}
