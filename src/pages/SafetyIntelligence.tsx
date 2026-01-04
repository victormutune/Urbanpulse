import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { safetyTrendData, cityZones } from '@/data/mockData';
import { Shield, AlertTriangle, Moon, Navigation, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const crimeData = [
  { type: 'Theft', count: 45, change: -12 },
  { type: 'Vandalism', count: 23, change: -8 },
  { type: 'Assault', count: 8, change: -25 },
  { type: 'Fraud', count: 15, change: 5 },
  { type: 'Other', count: 12, change: -3 },
];

const safeRoutes = [
  { from: 'Downtown Core', to: 'Tech District', safety: 94, time: '12 min' },
  { from: 'Harbor Front', to: 'Shopping District', safety: 91, time: '18 min' },
  { from: 'University Zone', to: 'Arts Quarter', safety: 88, time: '15 min' },
];

export default function SafetyIntelligence() {
  return (
    <Layout title="Safety Intelligence" subtitle="Monitor safety levels and crime trends">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Overall Safety', value: 92, icon: Shield, color: 'text-success', trend: 3.2 },
            { label: 'Incidents Today', value: 12, icon: AlertTriangle, color: 'text-warning', trend: -15 },
            { label: 'Night Safety', value: 78, icon: Moon, color: 'text-primary', trend: 5.1 },
            { label: 'Safe Routes', value: 24, icon: Navigation, color: 'text-secondary', trend: 8 },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn('p-2 rounded-lg bg-current/10', stat.color)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  stat.trend > 0 ? 'text-success' : 'text-destructive'
                )}>
                  {stat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.trend)}%
                </div>
              </div>
              <div className="text-2xl font-display font-bold">{stat.value}{stat.label.includes('Safety') ? '%' : ''}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 neon-border-cyan"
          >
            <h3 className="font-display font-semibold mb-4">Weekly Safety Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={safetyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} domain={[70, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 30%, 25%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(186, 100%, 50%)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(186, 100%, 50%)', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(186, 100%, 50%)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Crime Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 neon-border-magenta"
          >
            <h3 className="font-display font-semibold mb-4">Crime Types (This Week)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={false} />
                  <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="type" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 30%, 25%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {crimeData.map((entry, index) => (
                      <Cell key={index} fill={entry.change < 0 ? 'hsl(142, 76%, 45%)' : 'hsl(38, 92%, 50%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Safe Routes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Navigation className="w-5 h-5 text-success" />
            <h3 className="font-display font-semibold">Recommended Safe Routes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeRoutes.map((route, index) => (
              <div key={index} className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-success" />
                  </div>
                  <div className="text-2xl font-display font-bold text-success">{route.safety}%</div>
                </div>
                <div className="text-sm font-medium mb-1">{route.from} → {route.to}</div>
                <div className="text-xs text-muted-foreground">Estimated time: {route.time}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Zone Safety Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {cityZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + 0.05 * index }}
              className="glass rounded-lg p-4 text-center hover:scale-105 transition-transform cursor-pointer"
            >
              <div className={cn(
                'text-2xl font-display font-bold mb-1',
                zone.safetyScore >= 90 && 'text-success',
                zone.safetyScore >= 80 && zone.safetyScore < 90 && 'text-primary',
                zone.safetyScore >= 70 && zone.safetyScore < 80 && 'text-warning',
                zone.safetyScore < 70 && 'text-destructive'
              )}>
                {zone.safetyScore}%
              </div>
              <div className="text-xs text-muted-foreground truncate">{zone.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
