import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { businessHotspots } from '@/data/mockData';
import { TrendingUp, Users, Building2, DollarSign, MapPin, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const industryData = [
  { name: 'Retail', value: 35, color: 'hsl(186, 100%, 50%)' },
  { name: 'F&B', value: 28, color: 'hsl(320, 100%, 60%)' },
  { name: 'Services', value: 22, color: 'hsl(142, 76%, 45%)' },
  { name: 'Tech', value: 15, color: 'hsl(38, 92%, 50%)' },
];

export default function BusinessHotspots() {
  return (
    <Layout title="Business Hotspot Analyzer" subtitle="Discover the best areas for business">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Businesses', value: '3,247', icon: Building2, color: 'text-primary' },
            { label: 'Daily Foot Traffic', value: '428K', icon: Users, color: 'text-secondary' },
            { label: 'Avg. Profitability', value: '91%', icon: DollarSign, color: 'text-success' },
            { label: 'Growth Rate', value: '+15.4%', icon: TrendingUp, color: 'text-warning' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass rounded-xl p-5"
            >
              <div className={cn('p-2 rounded-lg bg-current/10 w-fit mb-3', stat.color)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <div className="text-2xl font-display font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Foot Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-xl p-6 neon-border-cyan"
          >
            <h3 className="font-display font-semibold mb-4">Foot Traffic by Zone</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={businessHotspots}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 30%, 25%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${(value/1000).toFixed(0)}K`, 'Traffic']}
                  />
                  <Bar dataKey="footTraffic" radius={[4, 4, 0, 0]}>
                    {businessHotspots.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? 'hsl(186, 100%, 50%)' : 'hsl(222, 30%, 35%)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Industry Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-display font-semibold mb-4">Industry Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 30%, 25%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {industryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6 neon-border-magenta"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Top Business Zones</h3>
            <span className="text-xs text-muted-foreground">Ranked by profitability</span>
          </div>
          <div className="space-y-4">
            {businessHotspots.map((zone, index) => (
              <div
                key={zone.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg',
                  index === 0 && 'bg-primary/20 text-primary',
                  index === 1 && 'bg-secondary/20 text-secondary',
                  index === 2 && 'bg-warning/20 text-warning',
                  index > 2 && 'bg-muted text-muted-foreground'
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium group-hover:text-primary transition-colors">{zone.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {zone.businessCount} businesses • {(zone.footTraffic / 1000).toFixed(0)}K daily visitors
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-display font-bold text-success">{zone.profitability}%</div>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="w-3 h-3" />
                    {zone.growthRate}% growth
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20 glow-cyan">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-2">Best Area to Open a Business</h3>
              <p className="text-muted-foreground mb-4">
                Based on our analysis, <span className="text-foreground font-medium">Tech District</span> shows the highest growth potential 
                with a 22.3% year-over-year increase. Combined with strong foot traffic and emerging tech ecosystem, 
                this area is ideal for new ventures.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/30">
                  <div className="text-success font-display font-bold">22.3%</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="text-primary font-display font-bold">65K</div>
                  <div className="text-xs text-muted-foreground">Daily Traffic</div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/30">
                  <div className="text-secondary font-display font-bold">328</div>
                  <div className="text-xs text-muted-foreground">Businesses</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
