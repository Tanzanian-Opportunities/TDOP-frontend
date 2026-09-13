import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { NotificationData } from '@/context/NotificationContext';

interface ToastProps {
  notification: NotificationData;
  onDismiss?: (id: string) => void;
  className?: string;
}

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colorMap = {
  info: 'border-blue-500 bg-blue-50',
  success: 'border-green-500 bg-green-50',
  warning: 'border-yellow-500 bg-yellow-50',
  error: 'border-red-500 bg-red-50',
};

const textColorMap = {
  info: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
};

export const Toast: React.FC<ToastProps> = ({ notification, onDismiss, className = '' }) => {
  const Icon = iconMap[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border-l-4 ${colorMap[notification.type]} shadow-lg animate-slide-down ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${textColorMap[notification.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-tdop-navy">{notification.title}</p>
        <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss?.(notification.id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  notifications: NotificationData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-sm w-full">
      {notifications.slice(0, 5).map(notif => (
        <Toast key={notif.id} notification={notif} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
