import { Target, Newspaper, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  notifications: Notification[];
}

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

export function RecentActivity({ notifications }: RecentActivityProps) {
  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {notifications.slice(0, 5).map((notification) => {
          const Icon = iconMap[notification.type];
          return (
            <div
              key={notification.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors',
                !notification.read && 'bg-secondary/30'
              )}
            >
              <div className={cn('p-2 rounded-lg', colorMap[notification.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {notification.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
