// ========================================================================
// Notification Toast Component
// ========================================================================

"use client";

import * as React from "react";
import { X, Bell, Calendar, AlertTriangle, Repeat } from "lucide-react";

interface ToastNotification {
  id: string;
  type: string;
  task_id: number;
  task_title: string;
  reminder_type: string;
  message: string;
  due_date?: string;
  timestamp?: string;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
}

const reminderIcons: Record<string, React.ReactNode> = {
  due_soon: <Calendar className="w-5 h-5 text-blue-600" />,
  due_now: <Bell className="w-5 h-5 text-orange-600" />,
  overdue: <AlertTriangle className="w-5 h-5 text-red-600" />,
  recurring: <Repeat className="w-5 h-5 text-purple-600" />,
};

const reminderColors: Record<string, string> = {
  due_soon: "bg-blue-50 border-blue-200",
  due_now: "bg-orange-50 border-orange-200",
  overdue: "bg-red-50 border-red-200",
  recurring: "bg-purple-50 border-purple-200",
};

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    // Enter animation
    const enterTimer = setTimeout(() => setIsVisible(true), 10);
    // Auto-exit after 5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      // Remove after exit animation
      setTimeout(() => onClose(notification.id), 300);
    }, 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [notification.id, onClose]);

  const icon = reminderIcons[notification.reminder_type] || <Bell className="w-5 h-5 text-gray-600" />;
  const colorClass = reminderColors[notification.reminder_type] || "bg-gray-50 border-gray-200";

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        max-w-sm w-full
        transition-all duration-300 ease-in-out
        ${colorClass}
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
        ${isExiting ? "opacity-0 translate-x-full" : ""}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 p-2 rounded-full bg-white/50">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600">
            {notification.reminder_type.replace("_", " ")}
          </span>
        </div>
        <h4 className="font-semibold text-gray-900 truncate">
          {notification.task_title}
        </h4>
        <p className="text-sm text-gray-700 mt-1">
          {notification.message}
        </p>
        {notification.due_date && (
          <p className="text-xs text-gray-500 mt-2">
            Due: {new Date(notification.due_date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(notification.id), 300);
        }}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}

// ========================================================================
// Notification Toast Container
// ========================================================================

interface NotificationContainerProps {
  toasts: Array<{
    id: string;
    notification: ToastNotification;
  }>;
  onClose: (id: string) => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

export function NotificationContainer({
  toasts,
  onClose,
  position = "top-right",
}: NotificationContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={`
        fixed z-50 flex flex-col gap-2 pointer-events-none
        ${positionClasses[position]}
      `}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <NotificationToast
            notification={toast.notification}
            onClose={onClose}
          />
        </div>
      ))}
    </div>
  );
}

// ========================================================================
// Demo Component (for testing)
// ========================================================================

export function NotificationDemo() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    notification: ToastNotification;
  }>>([]);

  const addDemoToast = (type: string) => {
    const id = Math.random().toString(36).substring(7);
    const notifications: Record<string, ToastNotification> = {
      due_soon: {
        id,
        type: "reminder",
        task_id: 1,
        task_title: "Team Meeting",
        reminder_type: "due_soon",
        message: "Meeting starts in 30 minutes",
        due_date: new Date(Date.now() + 1800000).toISOString(),
        timestamp: new Date().toISOString(),
      },
      due_now: {
        id,
        type: "reminder",
        task_id: 2,
        task_title: "Submit Report",
        reminder_type: "due_now",
        message: "Report is due now!",
        due_date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      },
      overdue: {
        id,
        type: "reminder",
        task_id: 3,
        task_title: "Pay Bills",
        reminder_type: "overdue",
        message: "This task is overdue",
        due_date: new Date(Date.now() - 86400000).toISOString(),
        timestamp: new Date().toISOString(),
      },
    };

    setToasts((prev) => [...prev, { id, notification: notifications[type] }]);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Notification Demo</h3>
      <div className="flex gap-2">
        <button
          onClick={() => addDemoToast("due_soon")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Due Soon
        </button>
        <button
          onClick={() => addDemoToast("due_now")}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Due Now
        </button>
        <button
          onClick={() => addDemoToast("overdue")}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Overdue
        </button>
      </div>

      <NotificationContainer
        toasts={toasts}
        onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
