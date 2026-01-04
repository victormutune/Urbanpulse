import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { LeafletCityMap } from '@/components/map/LeafletCityMap';
import { cityZones, Zone } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shield, Car, TrendingUp, Calendar, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const crowdLevelLabels = {
  low: 'Calm',
  moderate: 'Moderate',
  high: 'Busy',
  critical: 'Crowded',
};

const crowdLevelColors = {
  low: 'text-success',
  moderate: 'text-primary',
  high: 'text-warning',
  critical: 'text-destructive',
};

export default function LiveMap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <Layout title="Live City Map" subtitle="Real-time heatmap visualization with geolocation">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <LeafletCityMap 
            zones={cityZones} 
            onZoneClick={setSelectedZone}
          />
        </div>

        {/* Zone Details Panel */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div
                key={selectedZone.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-xl p-6 neon-border-cyan"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg">{selectedZone.name}</h3>
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="p-1 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Crowd Level */}
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Crowd Level</span>
                    </div>
                    <div className={cn('text-2xl font-display font-bold', crowdLevelColors[selectedZone.crowdLevel])}>
                      {crowdLevelLabels[selectedZone.crowdLevel]}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-3 h-3 text-success" />
                        <span className="text-xs text-muted-foreground">Safety</span>
                      </div>
                      <span className="text-xl font-bold">{selectedZone.safetyScore}%</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Car className="w-3 h-3 text-warning" />
                        <span className="text-xs text-muted-foreground">Traffic</span>
                      </div>
                      <span className="text-xl font-bold">{selectedZone.trafficLevel}%</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-secondary" />
                        <span className="text-xs text-muted-foreground">Events</span>
                      </div>
                      <span className="text-xl font-bold">{selectedZone.activeEvents}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="text-xs text-muted-foreground">Business</span>
                      </div>
                      <span className="text-xl font-bold">{selectedZone.businessActivity}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Navigation className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Your Location</h3>
                <p className="text-sm text-muted-foreground">
                  The map will automatically center on your current location and show nearby crowd density.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Stats */}
          <div className="glass rounded-xl p-4">
            <h4 className="font-display font-semibold mb-3 text-sm">Nearby Zones</h4>
            <div className="space-y-2">
              {cityZones.slice(0, 5).map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <span className="text-sm">{zone.name}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', crowdLevelColors[zone.crowdLevel], 'bg-current/10')}>
                    {crowdLevelLabels[zone.crowdLevel]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
