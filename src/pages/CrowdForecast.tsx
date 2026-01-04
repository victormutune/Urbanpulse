import { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { crowdForecastData, cityZones, Zone } from '@/data/mockData';
import { useLocation } from '@/contexts/LocationContext';
import { Clock, TrendingUp, Users, MapPin, Radio, Navigation, Map as MapIcon, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get nearby zones based on user location
const getNearbyZones = (userLat: number, userLng: number, zones: Zone[], maxDistance: number = 10) => {
  // Since zones only have x,y coordinates (not real lat/lng), we'll simulate proximity
  // by converting zone coordinates to approximate lat/lng relative to user location
  const nearbyZones = zones.map((zone, index) => {
    // Simulate lat/lng based on zone coordinates (treating them as offsets in degrees)
    const zoneLat = userLat + (zone.coordinates.y - 50) * 0.01; // Convert y to lat offset
    const zoneLng = userLng + (zone.coordinates.x - 50) * 0.01; // Convert x to lng offset
    
    const distance = calculateDistance(userLat, userLng, zoneLat, zoneLng);
    
    return {
      ...zone,
      distance,
      zoneLat,
      zoneLng,
    };
  }).filter(zone => zone.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
  
  return nearbyZones.length > 0 ? nearbyZones : zones.slice(0, 4).map(zone => ({ ...zone, distance: 0, zoneLat: userLat, zoneLng: userLng }));
};

// Generate real-time hourly data based on current time and nearby zones
const generateHourlyData = (nearbyZones: Array<Zone & { distance: number }>) => {
  const now = new Date();
  const currentHour = now.getHours();
  const hours = [];
  
  // Calculate average crowd level from nearby zones
  const avgCrowdLevel = nearbyZones.reduce((sum, zone) => {
    const levelMap = { low: 25, moderate: 50, high: 75, critical: 95 };
    return sum + levelMap[zone.crowdLevel];
  }, 0) / nearbyZones.length;
  
  for (let i = 0; i < 9; i++) {
    const hour = (currentHour + i) % 24;
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hourLabel = `${hour12}${ampm}`;
    
    // Generate crowd levels with time-based patterns and nearby zone influence
    let baseCrowd = avgCrowdLevel * 0.6;
    if (hour >= 6 && hour < 10) baseCrowd = avgCrowdLevel * 0.7 + Math.random() * 25; // Morning rush
    else if (hour >= 10 && hour < 14) baseCrowd = avgCrowdLevel * 0.9 + Math.random() * 20; // Midday
    else if (hour >= 14 && hour < 18) baseCrowd = avgCrowdLevel * 0.8 + Math.random() * 25; // Afternoon
    else if (hour >= 18 && hour < 22) baseCrowd = avgCrowdLevel * 1.1 + Math.random() * 20; // Evening peak
    else if (hour >= 22 || hour < 6) baseCrowd = avgCrowdLevel * 0.4 + Math.random() * 20; // Night
    
    const crowd = Math.round(baseCrowd + (Math.random() - 0.5) * 15);
    const normalizedCrowd = Math.max(5, Math.min(100, crowd));
    const best = normalizedCrowd < 30;
    
    hours.push({ hour: hourLabel, crowd: normalizedCrowd, best, hourValue: hour });
  }
  
  return hours;
};

// Generate real-time forecast data based on nearby zones
const generateForecastData = (nearbyZones: Array<Zone & { distance: number }>, zoneName: string) => {
  const now = new Date();
  const currentHour = now.getHours();
  const data = [];
  
  const avgCrowdLevel = nearbyZones.reduce((sum, zone) => {
    const levelMap = { low: 25, moderate: 50, high: 75, critical: 95 };
    return sum + levelMap[zone.crowdLevel];
  }, 0) / nearbyZones.length;
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;
    
    // Generate predicted values with time-based patterns and location context
    let predicted = avgCrowdLevel * 0.7;
    if (hour >= 6 && hour < 10) predicted = avgCrowdLevel * 0.8 + Math.random() * 20;
    else if (hour >= 10 && hour < 14) predicted = avgCrowdLevel * 1.0 + Math.random() * 20;
    else if (hour >= 14 && hour < 18) predicted = avgCrowdLevel * 0.85 + Math.random() * 25;
    else if (hour >= 18 && hour < 22) predicted = avgCrowdLevel * 1.15 + Math.random() * 15;
    else if (hour >= 22 || hour < 6) predicted = avgCrowdLevel * 0.5 + Math.random() * 15;
    
    const actual = i === 0 
      ? predicted + (Math.random() - 0.5) * 10
      : predicted + (Math.random() - 0.5) * 15;
    
    data.push({
      hour: hourStr,
      predicted: Math.round(Math.max(5, Math.min(100, predicted))),
      actual: Math.round(Math.max(5, Math.min(100, actual))),
      zone: zoneName,
    });
  }
  
  return data;
};

// Find best times based on current data and nearby zones
const findBestTimes = (
  hourlyData: Array<{ hour: string; crowd: number; hourValue: number }>,
  nearbyZones: Array<Zone & { distance: number }>
) => {
  const sorted = [...hourlyData].sort((a, b) => a.crowd - b.crowd);
  const best = sorted.slice(0, 3);
  
  return best.map((item, index) => {
    const zone = nearbyZones[index % nearbyZones.length];
    const reasons = [
      'Lowest crowd density',
      'Off-peak period',
      'Quiet time',
      'Best conditions',
      'Optimal timing',
    ];
    
    const startHour = item.hourValue;
    const endHour = (startHour + 2) % 24;
    const start12 = startHour === 0 ? 12 : startHour > 12 ? startHour - 12 : startHour;
    const end12 = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
    const startAMPM = startHour >= 12 ? 'PM' : 'AM';
    const endAMPM = endHour >= 12 ? 'PM' : 'AM';
    
    return {
      time: `${start12}:00 ${startAMPM} - ${end12}:00 ${endAMPM}`,
      location: zone.name,
      reason: reasons[index % reasons.length],
      distance: zone.distance.toFixed(1),
    };
  });
};

export default function CrowdForecast() {
  const { location, isLocating, requestLocation } = useLocation();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Get nearby zones based on user location
  const nearbyZones = useMemo(() => {
    if (!location) return cityZones.slice(0, 4).map(z => ({ ...z, distance: 0 }));
    return getNearbyZones(location.lat, location.lng, cityZones, 10);
  }, [location]);

  // Generate data based on nearby zones - updates when location changes
  const hourlyData = useMemo(() => generateHourlyData(nearbyZones), [nearbyZones, lastUpdate]);
  const forecastData = useMemo(() => generateForecastData(nearbyZones, location?.name || 'Your Area'), [nearbyZones, location, lastUpdate]);
  const bestTimes = useMemo(() => findBestTimes(hourlyData, nearbyZones), [hourlyData, nearbyZones]);

  // Update data every 5 seconds
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Generate real-time zone data with variations for nearby zones
  const realTimeZones = useMemo(() => {
    return nearbyZones.slice(0, 4).map(zone => ({
      ...zone,
      trafficLevel: Math.max(10, Math.min(100, zone.trafficLevel + Math.round((Math.random() - 0.5) * 20))),
    }));
  }, [nearbyZones, lastUpdate]);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Layout 
      title="Crowd Forecast Center" 
      subtitle="Predict busy zones and plan your movement"
    >
      <div className="space-y-6">
        {/* Location & Live Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between glass rounded-lg p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            {isLocating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Detecting your location...</span>
              </>
            ) : (
              <>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary" />
                    {location?.name || location?.city || 'Your Area'}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {location?.population && (
                      <div>Population: {location.population.toLocaleString()}</div>
                    )}
                    {(location?.state || location?.country) && (
                      <div>
                        {location.state && `${location.state}, `}
                        {location.country}
                      </div>
                    )}
                    <div>
                      Showing forecasts for {nearbyZones.length} nearby zone{nearbyZones.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocation}
                  className="shrink-0"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Location
                </Button>
              </>
            )}
          </div>
          {!isLocating && isLive && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-success animate-pulse" />
                <span className="text-sm font-medium text-success">LIVE</span>
              </div>
              <span className="text-xs text-muted-foreground">Updated {formatTime(lastUpdate)}</span>
            </div>
          )}
        </motion.div>
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Best Time Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 neon-border-cyan"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold">Best Time to Go</h3>
            </div>
            <div className="space-y-3">
              {bestTimes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 rounded-lg bg-success/10 border border-success/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm font-medium text-success">{item.time}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-foreground">{item.location}</span>
                    {item.distance && ` (${item.distance} km)`} — {item.reason}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hourly Crowd Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Hourly Crowd Prediction</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={cn(
                    "text-xs px-2 py-1 rounded transition-colors",
                    isLive 
                      ? "bg-success/20 text-success border border-success/30" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {isLive ? 'Live' : 'Paused'}
                </button>
                <div className="text-xs text-muted-foreground">Real-time Forecast</div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
                  <XAxis dataKey="hour" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(222, 30%, 25%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="crowd" radius={[4, 4, 0, 0]}>
                    {hourlyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.best ? 'hsl(142, 76%, 45%)' : entry.crowd > 80 ? 'hsl(0, 84%, 60%)' : 'hsl(186, 100%, 50%)'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Full Width Forecast Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 neon-border-magenta"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <h3 className="font-display font-semibold">24-Hour Crowd Forecast</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>Actual</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(186, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(320, 100%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="hour" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 30%, 25%)',
                    borderRadius: '8px',
                  }}
                />
                <Area type="monotone" dataKey="predicted" stroke="hsl(186, 100%, 50%)" strokeWidth={2} fill="url(#colorPred)" />
                <Area type="monotone" dataKey="actual" stroke="hsl(320, 100%, 60%)" strokeWidth={2} fill="url(#colorAct)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Zone Forecasts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {realTimeZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + 0.1 * index }}
              className="glass rounded-xl p-4 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{zone.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-display font-bold">{zone.trafficLevel}%</div>
                  <div className="text-xs text-muted-foreground">Expected crowd</div>
                </div>
                <div className={cn(
                  'px-2 py-1 rounded-full text-xs',
                  zone.crowdLevel === 'low' && 'bg-success/20 text-success',
                  zone.crowdLevel === 'moderate' && 'bg-primary/20 text-primary',
                  zone.crowdLevel === 'high' && 'bg-warning/20 text-warning',
                  zone.crowdLevel === 'critical' && 'bg-destructive/20 text-destructive',
                )}>
                  {zone.crowdLevel === 'low' && 'Best time now'}
                  {zone.crowdLevel === 'moderate' && 'Good'}
                  {zone.crowdLevel === 'high' && 'Avoid'}
                  {zone.crowdLevel === 'critical' && 'Very busy'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
