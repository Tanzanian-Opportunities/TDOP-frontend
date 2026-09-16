import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { PageError } from '@/components/ui/PageStates';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle, Clock, ExternalLink, Filter } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap: Record<string, string> = {
  info: 'bg-tdop-primary/10 text-tdop-primary',
  success: 'bg-emerald-50 text-tdop-secondary',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',
};

type CategoryFilter = 'all' | 'application' | 'opportunity' | 'profile' | 'system';

const categoryFilters: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'application', label: 'Applications' },
  { value: 'opportunity', label: 'Opportunities' },
  { value: 'profile', label: 'Profile' },
  { value: 'system', label: 'System' },
];

function categorizeNotification(title: string, message: string): CategoryFilter {
  const combined = `${title} ${message}`.toLowerCase();
  if (combined.includes('application') || combined.includes('applied') || combined.includes('shortlist') || combined.includes('interview')) return 'application';
  if (combined.includes('opportunity') || combined.includes('recommendation') || combined.includes('deadline') || combined.includes('new ')) return 'opportunity';
  if (combined.includes('profile') || combined.includes('skill') || combined.includes('document') || combined.includes('avatar')) return 'profile';
  return 'system';
}

function getDeepLink(title: string, message: string): string | null {
  const combined = `${title} ${message}`.toLowerCase();
  const oppMatch = combined.match(/opportunity\s*#?(\d+)/i) || combined.match(/job\s*#?(\d+)/i);
  if (oppMatch) return `/opportunities/${oppMatch[1]}`;
  const appMatch = combined.match(/application\s*#?(\d+)/i);
  if (appMatch) return `/applications/${appMatch[1]}`;
  if (combined.includes('application') && combined.includes('accept')) return '/applications';
  if (combined.includes('application') && (combined.includes('review') || combined.includes('submit'))) return '/applications';
  if (combined.includes('profile')) return '/profile';
  if (combined.includes('verification') || combined.includes('verify')) return '/profile';
  if (combined.includes('document') || combined.includes('cv') || combined.includes('resume')) return '/documents';
  if (combined.includes('recommendation')) return '/recommendations';
  return null;
}

const SeekerNotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, unreadCount, isLoading, isError, markAsRead, markAllAsRead } = useNotifications();
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return notifications;
    return notifications.filter((n: any) => categorizeNotification(n.title || '', n.message || '') === categoryFilter);
  }, [notifications, categoryFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tdop-primary" />
      </div>
    );
  }

  if (isError) return <PageError message="Failed to load notifications. Please try again." onRetry={() => {}} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy flex items-center gap-2">
            <Bell className="w-8 h-8 text-tdop-primary" />
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification(s)`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllAsRead()}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {categoryFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setCategoryFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === f.value
                  ? 'bg-tdop-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {notifications.length === 0 ? (
        <Card className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-tdop-navy mb-2">No notifications yet</h3>
          <p className="text-gray-500">You'll see updates about your applications and saved opportunities here.</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-tdop-navy mb-2">No matching notifications</h3>
          <p className="text-gray-500">Try a different filter.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif: any) => {
            const Icon = iconMap[notif.type] || Info;
            const iconColor = colorMap[notif.type] || colorMap.info;
            const timeAgo = notif.createdAt
              ? formatTimeAgo(new Date(notif.createdAt))
              : notif.timestamp
              ? formatTimeAgo(new Date(notif.timestamp))
              : '';
            const deepLink = getDeepLink(notif.title || '', notif.message || '');
            const category = categorizeNotification(notif.title || '', notif.message || '');

            return (
              <Card
                key={notif.id}
                className={`transition-all cursor-pointer ${!notif.read ? 'ring-1 ring-tdop-primary/20 bg-tdop-primary/[0.02]' : 'hover:bg-gray-50'}`}
                padding={false}
              >
                <div
                  className="p-4 flex items-start gap-4"
                  onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-sm ${!notif.read ? 'text-tdop-navy' : 'text-gray-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-tdop-primary shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {timeAgo && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo}
                        </span>
                      )}
                      <span className="text-xs text-gray-300 capitalize">{category}</span>
                      {deepLink && (
                        <Link
                          to={deepLink}
                          className="text-xs text-tdop-primary hover:underline flex items-center gap-1 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View details <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                      className="text-xs text-tdop-primary hover:text-blue-700 font-medium shrink-0 mt-1"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export default SeekerNotificationsPage;
