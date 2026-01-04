import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLocationData } from '@/services/geminiService';

interface Location {
  lat: number;
  lng: number;
  name?: string;
  population?: number;
  area?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location) => Promise<void>;
  isLocating: boolean;
  setIsLocating: (isLocating: boolean) => void;
  requestLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  // Default location (New York City)
  const defaultLocation: Location = { lat: 40.7128, lng: -74.006, name: 'New York City' };

  // Get user's location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('user-location');
    if (savedLocation) {
      try {
        setLocationState(JSON.parse(savedLocation));
        setIsLocating(false);
        return;
      } catch (e) {
        localStorage.removeItem('user-location');
      }
    }

    requestLocation();
  }, []);

  const requestLocation = async () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Fetch real location data using Gemini/service
            const locationData = await getLocationData(latitude, longitude);
            const newLocation: Location = {
              lat: latitude,
              lng: longitude,
              ...locationData,
            };
            setLocationState(newLocation);
            localStorage.setItem('user-location', JSON.stringify(newLocation));
            setIsLocating(false);
          } catch (error) {
            console.error('Error fetching location data:', error);
            const newLocation: Location = {
              lat: latitude,
              lng: longitude,
              name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            };
            setLocationState(newLocation);
            localStorage.setItem('user-location', JSON.stringify(newLocation));
            setIsLocating(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationState(defaultLocation);
          localStorage.setItem('user-location', JSON.stringify(defaultLocation));
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationState(defaultLocation);
      localStorage.setItem('user-location', JSON.stringify(defaultLocation));
      setIsLocating(false);
    }
  };

  const setLocation = async (newLocation: Location) => {
    try {
      // Fetch real location data when location is manually set
      const locationData = await getLocationData(newLocation.lat, newLocation.lng);
      const updatedLocation: Location = {
        ...newLocation,
        ...locationData,
      };
      setLocationState(updatedLocation);
      localStorage.setItem('user-location', JSON.stringify(updatedLocation));
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLocationState(newLocation);
      localStorage.setItem('user-location', JSON.stringify(newLocation));
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location: location || defaultLocation,
        setLocation,
        isLocating,
        setIsLocating,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

