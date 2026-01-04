import { motion } from 'framer-motion';
import { Zone } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface CityMapProps {
  zones: Zone[];
  onZoneClick?: (zone: Zone) => void;
}

const crowdLevelColors = {
  low: { bg: 'bg-success/40', border: 'border-success', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
  moderate: { bg: 'bg-primary/40', border: 'border-primary', glow: 'shadow-[0_0_15px_rgba(0,212,255,0.5)]' },
  high: { bg: 'bg-warning/40', border: 'border-warning', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' },
  critical: { bg: 'bg-destructive/40', border: 'border-destructive', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
};

export function CityMap({ zones, onZoneClick }: CityMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 h-[600px] relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold">City Heatmap</h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Calm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Busy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Crowded</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[calc(100%-60px)] bg-muted/20 rounded-lg border border-border overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:30px_30px] opacity-50" />

        {/* City Outline */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(222, 30%, 25%)" />
              <stop offset="100%" stopColor="hsl(222, 30%, 20%)" />
            </linearGradient>
          </defs>

          {/* Main Roads */}
          <path d="M0,50 L100,50" stroke="url(#roadGradient)" strokeWidth="0.8" fill="none" />
          <path d="M50,0 L50,100" stroke="url(#roadGradient)" strokeWidth="0.8" fill="none" />
          <path d="M20,0 L20,100" stroke="url(#roadGradient)" strokeWidth="0.4" fill="none" />
          <path d="M80,0 L80,100" stroke="url(#roadGradient)" strokeWidth="0.4" fill="none" />
          <path d="M0,25 L100,25" stroke="url(#roadGradient)" strokeWidth="0.4" fill="none" />
          <path d="M0,75 L100,75" stroke="url(#roadGradient)" strokeWidth="0.4" fill="none" />

          {/* Diagonal Roads */}
          <path d="M0,0 L100,100" stroke="url(#roadGradient)" strokeWidth="0.3" fill="none" opacity="0.5" />
          <path d="M100,0 L0,100" stroke="url(#roadGradient)" strokeWidth="0.3" fill="none" opacity="0.5" />
        </svg>

        {/* Zone Markers */}
        {zones.map((zone, index) => {
          const colors = crowdLevelColors[zone.crowdLevel];

          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, type: 'spring', stiffness: 200 }}
              className={cn(
                'absolute cursor-pointer group',
                'transform -translate-x-1/2 -translate-y-1/2'
              )}
              style={{
                left: `${zone.coordinates.x}%`,
                top: `${zone.coordinates.y}%`,
              }}
              onClick={() => onZoneClick?.(zone)}
            >
              {/* Pulse Ring */}
              <div
                className={cn(
                  'absolute inset-0 rounded-full animate-pulse-ring',
                  colors.bg
                )}
                style={{ width: '40px', height: '40px', margin: '-10px' }}
              />

              {/* Zone Dot */}
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 transition-transform duration-200 group-hover:scale-125',
                  colors.bg,
                  colors.border,
                  colors.glow
                )}
              />

              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-card/95 backdrop-blur-lg border border-border rounded-lg p-3 shadow-xl min-w-[160px]">
                  <p className="font-medium text-sm mb-2">{zone.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Safety:</span>
                      <span className="text-foreground">{zone.safetyScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events:</span>
                      <span className="text-foreground">{zone.activeEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business:</span>
                      <span className="text-foreground">{zone.businessActivity}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Scanning Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
