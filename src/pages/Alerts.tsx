import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { activeAlerts, Alert } from '@/data/mockData';
import { AlertTriangle, Users, Car, Zap, CalendarDays, Bell, BellOff, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const alertIcons = {
  overcrowding: Users,
  safety: AlertTriangle,
  traffic: Car,
  emergency: Zap,
  event: CalendarDays,
};

const severityStyles = {
  low: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', label: 'Low' },
  medium: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', label: 'Medium' },
  high: { bg: 'bg-neon-orange/10', border: 'border-neon-orange/30', text: 'text-neon-orange', label: 'High' },
  critical: { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', label: 'Critical' },
};

const typeLabels = {
  overcrowding: 'Overcrowding',
  safety: 'Safety Warning',
  traffic: 'Traffic Alert',
  emergency: 'Emergency',
  event: 'Event Notice',
};

export default function Alerts() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const filteredAlerts = activeAlerts.filter((alert) => {
    if (dismissedAlerts.includes(alert.id)) return false;
    if (filter === 'all') return true;
    return alert.severity === filter;
  });

  const alertCounts = {
    critical: activeAlerts.filter((a) => a.severity === 'critical').length,
    high: activeAlerts.filter((a) => a.severity === 'high').length,
    medium: activeAlerts.filter((a) => a.severity === 'medium').length,
    low: activeAlerts.filter((a) => a.severity === 'low').length,
  };

  return (
    <Layout title="Alerts & City Warnings" subtitle="Real-time emergency notifications and city alerts">
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'glass hover:bg-muted'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-background/20 text-xs">
                  {alertCounts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Critical', count: alertCounts.critical, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'High', count: alertCounts.high, color: 'text-neon-orange', bg: 'bg-neon-orange/10' },
            { label: 'Medium', count: alertCounts.medium, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Low', count: alertCounts.low, color: 'text-success', bg: 'bg-success/10' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn('glass rounded-xl p-4', stat.bg)}
            >
              <div className={cn('text-3xl font-display font-bold', stat.color)}>{stat.count}</div>
              <div className="text-sm text-muted-foreground">{stat.label} Priority</div>
            </motion.div>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-xl p-12 text-center"
            >
              <BellOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display font-semibold text-lg mb-2">No Alerts</h3>
              <p className="text-muted-foreground">All alerts have been addressed or filtered out.</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const Icon = alertIcons[alert.type];
              const styles = severityStyles[alert.severity];

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    'glass rounded-xl p-5 border-l-4 transition-all hover:scale-[1.01]',
                    styles.border
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('p-3 rounded-xl', styles.bg)}>
                      <Icon className={cn('w-6 h-6', styles.text)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', styles.bg, styles.text)}>
                              {styles.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {typeLabels[alert.type]}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">{alert.title}</h3>
                        </div>
                        <button
                          onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                          className="p-2 rounded-lg hover:bg-muted transition-colors group"
                          title="Dismiss alert"
                        >
                          <CheckCircle2 className="w-5 h-5 text-muted-foreground group-hover:text-success" />
                        </button>
                      </div>
                      <p className="text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {alert.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Alert Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-display font-semibold">Notification Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(typeLabels).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm">{label}</span>
                <div className="w-10 h-6 rounded-full bg-primary/30 relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
