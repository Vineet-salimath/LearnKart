import { Card, CardContent } from './Card';
import { cn } from '../../utils/helpers';

export function StatCard({ title, value, icon: Icon, trend, trendValue, className }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted">{title}</p>
            <p className="text-3xl font-bold text-text font-heading">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm font-medium flex items-center gap-1',
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </p>
            )}
          </div>
          {Icon && (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
