import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { notificationApi, Notification } from '@/services/api/notificationApi';
import { useNotificationContext } from '@/context/NotificationContext';
import { formatRelativeDate } from '@/utils/formatDate';
import { PageError } from '@/components/ui/PageStates';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  Bell,
  Shield,
  Briefcase,
  FileText,
  Clock,
  Users,
  Lock,
  CheckCheck,
  Loader2,
} from 'lucide-react';

const typeIconMap: Record<string, React.ReactNode> = {
  verification: <Shield className="w-5 h-5" />,
  opportunity: <Briefcase className="w-5 h-5" />,
  application: <FileText className="w-5 h-5" />,
  deadline: <Clock className="w-5 h-5" />,
  team: <Users className="w-5 h-5" />,
  security: <Lock className="w-5 h-5" />,
  system: <Bell className="w-5 h-5" />,
};

const typeColorMap: Record<string, string> = {
  verification: 'bg-blue-50 text-tdop-primary',
  opportunity: 'bg-emerald-50 text-tdop-secondary',
  application: 'bg-purple-50 text-purple-600',
  deadline: 'bg-amber-50 text-amber-600',
  team: 'bg-indigo-50 text-indigo-600',
  security: 'bg-red-50 text-red-600',
  system: 'bg-gray-100 text-gray-600',
};

const categories = [
  { key: 'all', label: 'All' },
  { key: 'verification', label: 'Verification' },
  { key: 'opportunity', label: 'Opportunity' },
  { key: 'application', label: 'Application' },
  { key: 'deadline', label: 'Deadline' },
  { key: 'team', label: 'Team' },
  { key: 'security', label: 'Security' },
  { key: 'system', label: 'System' },
];

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { markAllAsRead: contextMarkAllAsRead } = useNotificationContext();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await notificationApi.getNotifications();
      setNotifications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      contextMarkAllAsRead();
    } catch {
      // silently fail
    } finally {
      setMarkingAll(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await notificationApi.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
        );
      } catch {
        // silently fail
      }
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-6 h-6 text-tdop-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageError onRetry={fetchNotifications} />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications =
    activeCategory === 'all'
      ? notifications
      : notifications.filter(n => n.type === activeCategory);

  const hasUnread = unreadCount > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-tdop-navy font-display">
            {t('notifications.title', 'Notifications')}
          </h1>
          {unreadCount > 0 && (
            <Badge variant="primary" size="sm">
              {unreadCount}
            </Badge>
          )}
        </div>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            icon={markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
          >
            {t('notifications.markAllRead', 'Mark all as read')}
          </Button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.key
                ? 'bg-tdop-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-0 overflow-hidden">
          {notifications.length === 0 ? (
            <EmptyState
              icon={<Bell className="w-8 h-8 text-gray-300" />}
              title={t('notifications.emptyTitle', 'No notifications yet')}
              description={t('notifications.emptyDescription', 'Events requiring your attention will appear here.')}
            />
          ) : (
            <EmptyState
              icon={<CheckCheck className="w-8 h-8 text-gray-300" />}
              title={t('notifications.allReadTitle', "You're all caught up!")}
              description={t('notifications.allReadDescription', 'No unread notifications in this category.')}
            />
          )}
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden divide-y divide-gray-100">
          {filteredNotifications.map(notification => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-4 ${
                !notification.read ? 'bg-blue-50/30' : ''
              }`}
            >
              {/* Unread indicator */}
              <div className="pt-1.5 shrink-0">
                {!notification.read ? (
                  <span className="block w-2.5 h-2.5 rounded-full bg-tdop-primary" />
                ) : (
                  <span className="block w-2.5 h-2.5" />
                )}
              </div>

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  typeColorMap[notification.type] || typeColorMap.system
                }`}
              >
                {typeIconMap[notification.type] || typeIconMap.system}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm leading-snug ${
                    !notification.read
                      ? 'font-semibold text-tdop-navy'
                      : 'font-medium text-gray-700'
                  }`}
                >
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {formatRelativeDate(notification.createdAt)}
                </p>
              </div>

              {/* Action hint */}
              {notification.actionUrl && (
                <span className="text-xs text-tdop-primary font-medium whitespace-nowrap pt-1 shrink-0">
                  {t('notifications.view', 'View')} →
                </span>
              )}
            </button>
          ))}
        </Card>
      )}
    </div>
  );
};

export default NotificationsPage;
