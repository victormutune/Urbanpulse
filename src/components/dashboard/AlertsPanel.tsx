import { motion } from 'framer-motion';
import { AlertTriangle, Users, Car, Zap, CalendarDays } from 'lucide-react';
import { Alert } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AlertsPanelProps {
  alerts: Alert[];
  maxItems?: number;
}

const alertIcons = {
  overcrowding: Users,
  safety: AlertTriangle,
  traffic: Car,
  emergency: Zap,
  event: CalendarDays,
};

const severityStyles = {
  low: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    dot: 'bg-success',
  },
  medium: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  high: {
    bg: 'bg-neon-orange/10',
    border: 'border-neon-orange/30',
    text: 'text-neon-orange',
    dot: 'bg-neon-orange',
  },
  critical: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    text: 'text-destructive',
    dot: 'bg-destructive',
  },
};

export function AlertsPanel({ alerts, maxItems = 5 }: AlertsPanelProps) {
  const displayAlerts = alerts.slice(0, maxItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-xl p-6 neon-border-magenta"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-secondary" />
          Active Alerts
        </h3>
        <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full font-medium">
          {alerts.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {displayAlerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          const styles = severityStyles[alert.severity];

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                'p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] cursor-pointer',
                styles.bg,
                styles.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg', styles.bg)}>
                  <Icon className={cn('w-4 h-4', styles.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn('w-2 h-2 rounded-full animate-pulse', styles.dot)} />
                    <span className="text-sm font-medium truncate">{alert.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{alert.location}</span>
                    <span>•</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full uppercase font-medium',
                    styles.bg,
                    styles.text
                  )}
                >
                  {alert.severity}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg hover:border-primary/50">
        View All Alerts →
      </button>
    </motion.div>
  );
}
