import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Users,
  Shield,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Menu,
  X,
  Activity,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/live-map', label: 'Live Map', icon: Map },
  { path: '/crowd-forecast', label: 'Crowd Forecast', icon: Users },
  { path: '/safety', label: 'Safety Intel', icon: Shield },
  { path: '/events', label: 'Event Pulse', icon: Calendar },
  { path: '/business', label: 'Business Hotspots', icon: TrendingUp },
  { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <motion.div
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-cyan">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-glow-cyan whitespace-nowrap">
            UrbanPulse
          </span>
        </motion.div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-muted-foreground" />
          ) : (
            <X className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full glow-cyan"
                    />
                  )}
                  <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isCollapsed ? 0 : 1,
                      width: isCollapsed ? 0 : 'auto',
                    }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 w-2 h-2 rounded-full bg-primary pulse-glow"
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status Indicator */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-success" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-success animate-pulse-ring" />
          </div>
          <motion.span
            initial={false}
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden"
          >
            System Online
          </motion.span>
        </div>
      </div>
    </motion.aside>
  );
}
