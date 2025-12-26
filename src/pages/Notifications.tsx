import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockNotifications } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';
import {
  Target,
  Newspaper,
  AlertTriangle,
  TrendingUp,
  Check,
  Trash2,
  Bell,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Notification } from '@/types';

const iconMap = {
  new_target: Target,
  portfolio_alert: AlertTriangle,
  exit_signal: TrendingUp,
  news_alert: Newspaper,
};

const colorMap = {
  new_target: 'bg-primary/10 text-primary',
  portfolio_alert: 'bg-warning/10 text-warning',
  exit_signal: 'bg-accent/10 text-accent',
  news_alert: 'bg-info/10 text-info',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <MainLayout title="Notifications" subtitle={`${unreadCount} unread notifications`}>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'unread', 'new_target', 'portfolio_alert', 'exit_signal'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all'
                ? 'All'
                : f === 'unread'
                ? 'Unread'
                : f === 'new_target'
                ? 'Targets'
                : f === 'portfolio_alert'
                ? 'Alerts'
                : 'Exit Signals'}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <Check className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="metric-card text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'unread'
                ? "You're all caught up!"
                : 'No notifications match this filter.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <div
                key={notification.id}
                className={cn(
                  'metric-card flex items-start gap-4 cursor-pointer transition-all hover:border-primary/50',
                  !notification.read && 'border-primary/30 bg-secondary/30'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={cn('p-3 rounded-lg', colorMap[notification.type])}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Badge className="bg-primary/20 text-primary">New</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </MainLayout>
  );
};

export default Notifications;
