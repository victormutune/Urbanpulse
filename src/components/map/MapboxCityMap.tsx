import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { Zone } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface MapboxCityMapProps {
  zones: Zone[];
  onZoneClick?: (zone: Zone) => void;
  mapboxToken: string;
}

// Convert zone crowd levels to heatmap intensity
const crowdLevelIntensity = {
  low: 0.2,
  moderate: 0.5,
  high: 0.75,
  critical: 1,
};

const crowdLevelColors = {
  low: '#22c55e',
  moderate: '#00d4ff',
  high: '#f59e0b',
  critical: '#ef4444',
};

export function MapboxCityMap({ zones, onZoneClick, mapboxToken }: MapboxCityMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Default center (New York City)
  const defaultCenter: [number, number] = [-74.006, 40.7128];

  // Generate heatmap data from zones around user location or default
  const generateHeatmapData = (centerLng: number, centerLat: number) => {
    return zones.map((zone, index) => {
      // Distribute zones around the center
      const angle = (index / zones.length) * 2 * Math.PI;
      const radius = 0.02 + Math.random() * 0.03; // ~2-5km spread
      return {
        type: 'Feature' as const,
        properties: {
          intensity: crowdLevelIntensity[zone.crowdLevel],
          zone: zone,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [
            centerLng + Math.cos(angle) * radius,
            centerLat + Math.sin(angle) * radius,
          ],
        },
      };
    });
  };

  // Get user's current location
  const getUserLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation({ lng: longitude, lat: latitude });
          setIsLocating(false);

          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 14,
              duration: 2000,
            });

            // Update or create user marker
            if (userMarker.current) {
              userMarker.current.setLngLat([longitude, latitude]);
            } else {
              const el = document.createElement('div');
              el.className = 'user-location-marker';
              el.innerHTML = `
                <div class="relative">
                  <div class="w-6 h-6 bg-primary rounded-full border-2 border-background shadow-lg flex items-center justify-center">
                    <div class="w-2 h-2 bg-background rounded-full"></div>
                  </div>
                  <div class="absolute inset-0 bg-primary/50 rounded-full animate-ping"></div>
                </div>
              `;
              userMarker.current = new mapboxgl.Marker(el)
                .setLngLat([longitude, latitude])
                .addTo(map.current);
            }

            // Update heatmap data around user location
            updateHeatmapData(longitude, latitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const updateHeatmapData = (lng: number, lat: number) => {
    if (!map.current || !map.current.getSource('crowd-density')) return;

    const heatmapData = generateHeatmapData(lng, lat);
    (map.current.getSource('crowd-density') as mapboxgl.GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: heatmapData,
    });
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: defaultCenter,
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add heatmap source
      const heatmapData = generateHeatmapData(defaultCenter[0], defaultCenter[1]);
      map.current!.addSource('crowd-density', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: heatmapData,
        },
      });

      // Add heatmap layer
      map.current!.addLayer({
        id: 'crowd-heat',
        type: 'heatmap',
        source: 'crowd-density',
        maxzoom: 18,
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            18, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, 'rgba(34,197,94,0.4)',
            0.4, 'rgba(0,212,255,0.5)',
            0.6, 'rgba(245,158,11,0.6)',
            0.8, 'rgba(239,68,68,0.7)',
            1, 'rgba(239,68,68,0.9)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 20,
            18, 80
          ],
          'heatmap-opacity': 0.8
        }
      });

      // Add zone markers
      zones.forEach((zone, index) => {
        const angle = (index / zones.length) * 2 * Math.PI;
        const radius = 0.02 + Math.random() * 0.03;
        const lng = defaultCenter[0] + Math.cos(angle) * radius;
        const lat = defaultCenter[1] + Math.sin(angle) * radius;

        const el = document.createElement('div');
        el.className = 'zone-marker cursor-pointer';
        el.innerHTML = `
          <div class="relative group">
            <div class="w-4 h-4 rounded-full border-2 transition-transform hover:scale-125" 
                 style="background-color: ${crowdLevelColors[zone.crowdLevel]}40; 
                        border-color: ${crowdLevelColors[zone.crowdLevel]};
                        box-shadow: 0 0 15px ${crowdLevelColors[zone.crowdLevel]}80;">
            </div>
          </div>
        `;

        el.addEventListener('click', () => {
          onZoneClick?.(zone);
        });

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: 'zone-popup',
        }).setHTML(`
          <div class="bg-card/95 backdrop-blur-lg p-3 rounded-lg min-w-[160px]">
            <p class="font-semibold text-sm mb-2 text-foreground">${zone.name}</p>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Safety:</span>
                <span class="text-foreground">${zone.safetyScore}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Events:</span>
                <span class="text-foreground">${zone.activeEvents}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Business:</span>
                <span class="text-foreground">${zone.businessActivity}%</span>
              </div>
            </div>
          </div>
        `);

        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Auto-locate user on load
      getUserLocation();
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

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
          {userLocation && (
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
      <div ref={mapContainer} className="absolute inset-6 top-16 rounded-lg overflow-hidden" />

      {/* Custom Controls */}
      <div className="absolute right-10 bottom-10 flex flex-col gap-2 z-10">
        <button
          onClick={getUserLocation}
          disabled={isLocating}
          className={cn(
            "p-3 rounded-lg glass border border-border hover:border-primary transition-colors",
            isLocating && "animate-pulse"
          )}
          title="Find my location"
        >
          <MapPin className={cn("w-5 h-5", isLocating ? "text-primary" : "text-foreground")} />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-3 rounded-lg glass border border-border hover:border-primary transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-3 rounded-lg glass border border-border hover:border-primary transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
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
