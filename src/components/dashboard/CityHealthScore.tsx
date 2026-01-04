import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CityHealthScoreProps {
  score: number;
}

export function CityHealthScore({ score }: CityHealthScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'text-success stroke-success';
    if (score >= 60) return 'text-primary stroke-primary';
    if (score >= 40) return 'text-warning stroke-warning';
    return 'text-destructive stroke-destructive';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Critical';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-xl p-6 neon-border-cyan"
    >
      <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        City Health Score
      </h3>

      <div className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          {/* Background Circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={cn('transition-colors duration-500', getScoreColor())}
              style={{
                strokeDasharray: circumference,
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn('text-4xl font-display font-bold', getScoreColor().split(' ')[0])}
            >
              {score}
            </motion.span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {getScoreLabel()}
            </span>
          </div>

          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {['Safety', 'Traffic', 'Crowd', 'Energy'].map((label, i) => (
          <div key={label} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="text-sm font-semibold">{85 + i * 3}%</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
