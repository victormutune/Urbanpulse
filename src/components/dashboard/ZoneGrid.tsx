import { motion } from 'framer-motion';
import { MapPin, Users, Shield, TrendingUp } from 'lucide-react';
import { Zone } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ZoneGridProps {
  zones: Zone[];
}

const crowdLevelStyles = {
  low: { bg: 'bg-success/20', text: 'text-success', label: 'Calm' },
  moderate: { bg: 'bg-primary/20', text: 'text-primary', label: 'Moderate' },
  high: { bg: 'bg-warning/20', text: 'text-warning', label: 'Busy' },
  critical: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Crowded' },
};

export function ZoneGrid({ zones }: ZoneGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Zone Overview
        </h3>
        <span className="text-xs text-muted-foreground">
          {zones.length} zones monitored
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {zones.slice(0, 6).map((zone, index) => {
          const crowdStyle = crowdLevelStyles[zone.crowdLevel];

          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {zone.name}
                </h4>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', crowdStyle.bg, crowdStyle.text)}>
                  {crowdStyle.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span>{zone.activeEvents}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  <span>{zone.safetyScore}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span>{zone.businessActivity}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
