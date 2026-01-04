import { Bell, Search, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { activeAlerts } from '@/data/mockData';
import { useNotifications } from '@/hooks/useNotifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const { permission, requestPermission, showNotification } = useNotifications();
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical' || a.severity === 'high').length;

  // Request notification permission on mount
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Show notifications for critical alerts
  useEffect(() => {
    const critical = activeAlerts.filter((a) => a.severity === 'critical');
    if (critical.length > 0 && permission === 'granted') {
      critical.forEach((alert) => {
        showNotification(alert.title, {
          body: `${alert.description} - ${alert.location}`,
          tag: alert.id,
          requireInteraction: true,
        });
      });
    }
  }, [permission, showNotification]);

  const handleNotificationClick = () => {
    if (permission !== 'granted') {
      requestPermission();
    }
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 glass-strong sticky top-0 z-40">
      <div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-xl font-bold tracking-wide"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search zones, events..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg bg-muted/50 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              {criticalAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-xs flex items-center justify-center font-medium">
                  {criticalAlerts}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              <div className="flex items-center justify-between">
                <span>Alerts & Notifications</span>
                {permission !== 'granted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      requestPermission();
                    }}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {activeAlerts.slice(0, 5).map((alert) => (
              <DropdownMenuItem key={alert.id} asChild>
                <Link to="/alerts" className="cursor-pointer">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">{alert.title}</span>
                    <span className="text-xs text-muted-foreground">{alert.location}</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
            {activeAlerts.length > 5 && (
              <DropdownMenuItem asChild>
                <Link to="/alerts" className="cursor-pointer text-center justify-center">
                  View all alerts
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium hidden md:block">{user?.name || 'User'}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-success" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-pulse-ring" />
          </div>
          <span className="text-xs font-medium text-success">LIVE</span>
        </div>
      </div>
    </header>
  );
}
