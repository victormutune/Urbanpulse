import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: ReactNode;
  trend?: { value: number; isPositive: boolean };
  variant?: 'cyan' | 'magenta' | 'success' | 'warning' | 'danger';
  delay?: number;
}

const variantStyles = {
  cyan: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    glow: 'glow-cyan',
    border: 'neon-border-cyan',
  },
  magenta: {
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    glow: 'glow-magenta',
    border: 'neon-border-magenta',
  },
  success: {
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    glow: 'glow-success',
    border: 'border-success',
  },
  warning: {
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    glow: 'glow-warning',
    border: 'border-warning',
  },
  danger: {
    iconBg: 'bg-destructive/10',
    iconColor: 'text-destructive',
    glow: 'glow-danger',
    border: 'border-destructive',
  },
};

export function StatCard({ title, value, suffix = '', icon, trend, variant = 'cyan', delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const styles = variantStyles[variant];

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass rounded-xl p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300',
        styles.border
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', styles.iconBg, styles.glow)}>
            <div className={styles.iconColor}>{icon}</div>
          </div>
          {trend && (
            <div
              className={cn(
                'text-xs font-medium px-2 py-1 rounded-full',
                trend.isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              )}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold tracking-wide">{displayValue}</span>
            {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
          </div>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] opacity-0 group-hover:opacity-100 animate-shimmer" />
    </motion.div>
  );
}
