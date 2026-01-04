import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Navigation, ZoomIn, ZoomOut, Layers, MapPin } from 'lucide-react';
import { Zone } from '@/data/mockData';
import { useLocation } from '@/contexts/LocationContext';
import { cn } from '@/lib/utils';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletCityMapProps {
  zones: Zone[];
  onZoneClick?: (zone: Zone) => void;
}

// Convert zone crowd levels to colors
const crowdLevelColors = {
  low: '#22c55e',
  moderate: '#00d4ff',
  high: '#f59e0b',
  critical: '#ef4444',
};

const crowdLevelRadius = {
  low: 8,
  moderate: 10,
  high: 12,
  critical: 14,
};

// Component to center map on user location
function LocationButton({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);

  const handleLocate = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 14, {
            animate: true,
            duration: 2,
          });
          onLocationFound(latitude, longitude);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <button
      onClick={handleLocate}
      disabled={isLocating}
      className={cn(
        'absolute right-4 bottom-20 z-[1000] p-3 rounded-lg glass border border-border hover:border-primary transition-colors',
        isLocating && 'animate-pulse'
      )}
      title="Find my location"
    >
      <Navigation className={cn('w-5 h-5', isLocating ? 'text-primary' : 'text-foreground')} />
    </button>
  );
}

// Component to handle zoom controls
function ZoomControls() {
  const map = useMap();

  return (
    <>
      <button
        onClick={() => map.zoomIn()}
        className="absolute right-4 bottom-32 z-[1000] p-3 rounded-lg glass border border-border hover:border-primary transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-5 h-5" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="absolute right-4 bottom-44 z-[1000] p-3 rounded-lg glass border border-border hover:border-primary transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-5 h-5" />
      </button>
    </>
  );
}

// Generate zone coordinates around a center point
const generateZoneCoordinates = (centerLat: number, centerLng: number, zones: Zone[]) => {
  return zones.map((zone, index) => {
    const angle = (index / zones.length) * 2 * Math.PI;
    const radius = 0.02 + (index % 3) * 0.01; // Spread zones around
    return {
      ...zone,
      lat: centerLat + Math.cos(angle) * radius,
      lng: centerLng + Math.sin(angle) * radius,
    };
  });
};

// Component to handle map clicks for location selection
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export function LeafletCityMap({ zones, onZoneClick }: LeafletCityMapProps) {
  const { location, setLocation, requestLocation } = useLocation();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoneCoordinates, setZoneCoordinates] = useState<Array<Zone & { lat: number; lng: number }>>([]);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Default center (New York City)
  const defaultCenter: [number, number] = [40.7128, -74.006];

  // Initialize map and update zones when location changes
  useEffect(() => {
    const centerLat = location?.lat || defaultCenter[0];
    const centerLng = location?.lng || defaultCenter[1];
    const coords = generateZoneCoordinates(centerLat, centerLng, zones);
    setZoneCoordinates(coords);
    setMapLoaded(true);
  }, [location, zones]);

  const handleLocationFound = (lat: number, lng: number) => {
    setLocation({ lat, lng, name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
    setSelectedMapLocation(null); // Clear map selection when using geolocation
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setSelectedMapLocation({ lat, lng });
    await setLocation({ lat, lng, name: `Selected Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
  };

  const center = location ? [location.lat, location.lng] as [number, number] : [40.7128, -74.006];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6 h-[600px] relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-display font-semibold">Live City Heatmap</h3>
          {location && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Navigation className="w-3 h-3 text-primary" />
              Located
            </span>
          )}
        </div>
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
      <div className="relative" style={{ height: 'calc(100% - 60px)', width: '100%' }}>
        {mapLoaded && (
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '8px', zIndex: 1 }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Zone Markers */}
            {zoneCoordinates.map((zone) => {
              const color = crowdLevelColors[zone.crowdLevel];
              const radius = crowdLevelRadius[zone.crowdLevel];
              
              return (
                <CircleMarker
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.6,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => {
                      onZoneClick?.(zone);
                    },
                  }}
                >
                  <Popup>
                    <div className="bg-card/95 backdrop-blur-lg p-3 rounded-lg min-w-[160px]">
                      <p className="font-semibold text-sm mb-2 text-foreground">{zone.name}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Safety:</span>
                          <span className="text-foreground">{zone.safetyScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Events:</span>
                          <span className="text-foreground">{zone.activeEvents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Business:</span>
                          <span className="text-foreground">{zone.businessActivity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Crowd:</span>
                          <span className="text-foreground capitalize">{zone.crowdLevel}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

          <MapClickHandler onLocationSelect={handleMapClick} />

          {/* User Location Marker */}
          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                <div className="bg-card/95 backdrop-blur-lg p-3 rounded-lg min-w-[200px]">
                  <p className="font-semibold text-sm mb-2 text-foreground">
                    {location.name || location.city || 'Your Location'}
                  </p>
                  {location.population && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Population: {location.population.toLocaleString()}
                    </p>
                  )}
                  {(location.state || location.country) && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {location.state && `${location.state}, `}
                      {location.country}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mb-2">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-primary mt-2 border-t border-border pt-2">
                    Click anywhere on the map to change location
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Selected Map Location Marker (temporary) */}
          {selectedMapLocation && selectedMapLocation.lat !== location?.lat && (
            <Marker 
              position={[selectedMapLocation.lat, selectedMapLocation.lng]}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
              })}
            >
              <Popup>New Location Selected</Popup>
            </Marker>
          )}

          <LocationButton onLocationFound={handleLocationFound} />
          <ZoomControls />
          
          {/* Location Selection Hint */}
          <div className="absolute top-4 left-4 z-[1000] glass rounded-lg p-3 border border-border shadow-lg backdrop-blur-lg bg-background/80 max-w-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground mb-1">Click map to set location</p>
                <p className="text-muted-foreground">
                  Click anywhere on the map to update forecasts for that area, or use the location button to use your current position.
                </p>
              </div>
            </div>
          </div>
          </MapContainer>
        )}
        
        {/* Legend Component - positioned over the map */}
        {mapLoaded && (
          <div className="absolute bottom-4 left-4 z-[1000] glass rounded-lg p-3 border border-border shadow-lg backdrop-blur-lg bg-background/80">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground mb-2">Crowd Levels</h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2" 
                    style={{ 
                      backgroundColor: `${crowdLevelColors.low}60`,
                      borderColor: crowdLevelColors.low,
                      boxShadow: `0 0 8px ${crowdLevelColors.low}80`
                    }}
                  />
                  <span className="text-xs text-foreground">Calm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2" 
                    style={{ 
                      backgroundColor: `${crowdLevelColors.moderate}60`,
                      borderColor: crowdLevelColors.moderate,
                      boxShadow: `0 0 8px ${crowdLevelColors.moderate}80`
                    }}
                  />
                  <span className="text-xs text-foreground">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2" 
                    style={{ 
                      backgroundColor: `${crowdLevelColors.high}60`,
                      borderColor: crowdLevelColors.high,
                      boxShadow: `0 0 8px ${crowdLevelColors.high}80`
                    }}
                  />
                  <span className="text-xs text-foreground">Busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2" 
                    style={{ 
                      backgroundColor: `${crowdLevelColors.critical}60`,
                      borderColor: crowdLevelColors.critical,
                      boxShadow: `0 0 8px ${crowdLevelColors.critical}80`
                    }}
                  />
                  <span className="text-xs text-foreground">Crowded</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-6 top-16 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <Layers className="w-8 h-8 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

