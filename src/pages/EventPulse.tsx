import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { trendingEvents } from '@/data/mockData';
import { Calendar, Users, TrendingUp, MapPin, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  Music: 'bg-secondary/20 text-secondary border-secondary/30',
  Technology: 'bg-primary/20 text-primary border-primary/30',
  Food: 'bg-warning/20 text-warning border-warning/30',
  Art: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30',
  Sports: 'bg-success/20 text-success border-success/30',
};

export default function EventPulse() {
  return (
    <Layout title="Event Pulse" subtitle="Trending events and crowd impact analysis">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Events', value: 23, icon: Calendar, color: 'text-primary' },
            { label: 'Total Attendees', value: '128K', icon: Users, color: 'text-secondary' },
            { label: 'Avg. Impact', value: '72%', icon: TrendingUp, color: 'text-warning' },
            { label: 'Trending', value: 5, icon: Star, color: 'text-success' },
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

        {/* Featured Event */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 neon-border-magenta relative overflow-hidden"
        >
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium animate-pulse">
              🔥 LIVE NOW
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className={cn('px-2 py-0.5 rounded-full text-xs w-fit border mb-3', categoryColors.Sports)}>
                Sports
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Championship Finals</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Downtown Core
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  8:00 PM
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                Major sporting event with significant crowd impact. Expect heavy traffic and overcrowding in surrounding areas.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-secondary">55K</div>
                <div className="text-xs text-muted-foreground">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-destructive">95%</div>
                <div className="text-xs text-muted-foreground">Crowd Impact</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary">99</div>
                <div className="text-xs text-muted-foreground">Popularity</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingEvents.slice(0, 4).map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + 0.1 * index }}
              className="glass rounded-xl p-5 hover:scale-[1.02] transition-transform cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn('px-2 py-0.5 rounded-full text-xs border', categoryColors[event.category] || categoryColors.Art)}>
                  {event.category}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="text-sm font-medium">{event.popularity}</span>
                </div>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{event.name}</h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.startTime}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded-lg bg-muted/30">
                  <div className="text-lg font-display font-bold">{(event.attendees / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-muted-foreground">Attendees</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/30">
                  <div className={cn(
                    'text-lg font-display font-bold',
                    event.crowdImpact >= 80 && 'text-destructive',
                    event.crowdImpact >= 50 && event.crowdImpact < 80 && 'text-warning',
                    event.crowdImpact < 50 && 'text-success'
                  )}>{event.crowdImpact}%</div>
                  <div className="text-xs text-muted-foreground">Impact</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Popularity Index */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="font-display font-semibold mb-4">Event Popularity Index</h3>
          <div className="space-y-3">
            {trendingEvents.map((event, index) => (
              <div key={event.id} className="flex items-center gap-4">
                <span className="text-lg font-display font-bold text-muted-foreground w-8">#{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{event.name}</span>
                    <span className="text-sm font-display">{event.popularity}</span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${event.popularity}%` }}
                      transition={{ delay: 0.6 + 0.1 * index, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
