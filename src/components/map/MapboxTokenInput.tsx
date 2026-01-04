import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Key, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

export function MapboxTokenInput({ onTokenSubmit }: MapboxTokenInputProps) {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      localStorage.setItem('mapbox-token', token.trim());
      onTokenSubmit(token.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-8 max-w-md mx-auto text-center"
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-primary" />
      </div>
      
      <h3 className="font-display font-bold text-xl mb-2">Enable Live Map</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your Mapbox public token to enable the interactive city map with real-time heatmaps.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={!token.trim()}>
          <MapPin className="w-4 h-4 mr-2" />
          Enable Map
        </Button>
      </form>

      <a
        href="https://mapbox.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 mt-4 text-xs text-primary hover:underline"
      >
        Get your free Mapbox token
        <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}
