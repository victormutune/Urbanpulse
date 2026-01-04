// Mock data for UrbanPulse AI

export interface CityMetrics {
  healthScore: number;
  crowdIndex: number;
  safetyIndex: number;
  trafficIntensity: number;
  activeAlerts: number;
  population: number;
}

export interface Zone {
  id: string;
  name: string;
  crowdLevel: 'low' | 'moderate' | 'high' | 'critical';
  safetyScore: number;
  trafficLevel: number;
  activeEvents: number;
  businessActivity: number;
  coordinates: { x: number; y: number };
}

export interface Alert {
  id: string;
  type: 'overcrowding' | 'safety' | 'traffic' | 'emergency' | 'event';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  location: string;
  time: string;
  description: string;
}

export interface Event {
  id: string;
  name: string;
  location: string;
  attendees: number;
  crowdImpact: number;
  popularity: number;
  startTime: string;
  category: string;
}

export interface BusinessZone {
  id: string;
  name: string;
  footTraffic: number;
  profitability: number;
  growthRate: number;
  businessCount: number;
}

export interface CrowdForecast {
  hour: string;
  predicted: number;
  actual: number;
  zone: string;
}

export interface SafetyTrend {
  date: string;
  score: number;
  incidents: number;
}

// City Overview Metrics
export const cityMetrics: CityMetrics = {
  healthScore: 87,
  crowdIndex: 64,
  safetyIndex: 92,
  trafficIntensity: 58,
  activeAlerts: 7,
  population: 2847563,
};

// City Zones
export const cityZones: Zone[] = [
  { id: '1', name: 'Downtown Core', crowdLevel: 'high', safetyScore: 78, trafficLevel: 85, activeEvents: 5, businessActivity: 94, coordinates: { x: 45, y: 35 } },
  { id: '2', name: 'Tech District', crowdLevel: 'moderate', safetyScore: 91, trafficLevel: 62, activeEvents: 2, businessActivity: 88, coordinates: { x: 65, y: 25 } },
  { id: '3', name: 'Harbor Front', crowdLevel: 'high', safetyScore: 85, trafficLevel: 45, activeEvents: 8, businessActivity: 76, coordinates: { x: 30, y: 60 } },
  { id: '4', name: 'University Zone', crowdLevel: 'critical', safetyScore: 88, trafficLevel: 72, activeEvents: 12, businessActivity: 65, coordinates: { x: 75, y: 45 } },
  { id: '5', name: 'Financial Hub', crowdLevel: 'moderate', safetyScore: 95, trafficLevel: 78, activeEvents: 1, businessActivity: 98, coordinates: { x: 50, y: 50 } },
  { id: '6', name: 'Arts Quarter', crowdLevel: 'low', safetyScore: 82, trafficLevel: 35, activeEvents: 6, businessActivity: 71, coordinates: { x: 25, y: 40 } },
  { id: '7', name: 'Residential North', crowdLevel: 'low', safetyScore: 94, trafficLevel: 28, activeEvents: 0, businessActivity: 45, coordinates: { x: 55, y: 15 } },
  { id: '8', name: 'Industrial Park', crowdLevel: 'low', safetyScore: 76, trafficLevel: 55, activeEvents: 0, businessActivity: 82, coordinates: { x: 85, y: 65 } },
  { id: '9', name: 'Central Park', crowdLevel: 'moderate', safetyScore: 89, trafficLevel: 15, activeEvents: 4, businessActivity: 32, coordinates: { x: 40, y: 45 } },
  { id: '10', name: 'Shopping District', crowdLevel: 'high', safetyScore: 86, trafficLevel: 68, activeEvents: 3, businessActivity: 92, coordinates: { x: 55, y: 70 } },
];

// Active Alerts
export const activeAlerts: Alert[] = [
  { id: '1', type: 'overcrowding', severity: 'high', title: 'Stadium Area Congestion', location: 'Downtown Core', time: '5 min ago', description: 'Major sports event causing crowd buildup' },
  { id: '2', type: 'traffic', severity: 'medium', title: 'Highway Slowdown', location: 'Tech District Access', time: '12 min ago', description: 'Accident reported, expect 20min delays' },
  { id: '3', type: 'event', severity: 'low', title: 'Concert Starting Soon', location: 'Harbor Front', time: '30 min ago', description: 'Expect increased foot traffic' },
  { id: '4', type: 'safety', severity: 'high', title: 'Power Outage', location: 'Arts Quarter Block C', time: '45 min ago', description: 'Street lights affected, crews dispatched' },
  { id: '5', type: 'emergency', severity: 'critical', title: 'Fire Response Active', location: 'Industrial Park', time: '1 hour ago', description: 'Emergency services on scene' },
  { id: '6', type: 'overcrowding', severity: 'medium', title: 'University Event', location: 'University Zone', time: '2 hours ago', description: 'Graduation ceremony in progress' },
  { id: '7', type: 'traffic', severity: 'low', title: 'Road Construction', location: 'Residential North', time: '3 hours ago', description: 'Lane closures until 6 PM' },
];

// Trending Events
export const trendingEvents: Event[] = [
  { id: '1', name: 'City Music Festival', location: 'Harbor Front', attendees: 45000, crowdImpact: 92, popularity: 98, startTime: '4:00 PM', category: 'Music' },
  { id: '2', name: 'Tech Conference 2024', location: 'Tech District', attendees: 12000, crowdImpact: 65, popularity: 87, startTime: '9:00 AM', category: 'Technology' },
  { id: '3', name: 'Food & Wine Expo', location: 'Downtown Core', attendees: 8500, crowdImpact: 58, popularity: 82, startTime: '11:00 AM', category: 'Food' },
  { id: '4', name: 'Art Gallery Opening', location: 'Arts Quarter', attendees: 2000, crowdImpact: 25, popularity: 71, startTime: '7:00 PM', category: 'Art' },
  { id: '5', name: 'Championship Finals', location: 'Downtown Core', attendees: 55000, crowdImpact: 95, popularity: 99, startTime: '8:00 PM', category: 'Sports' },
];

// Business Hotspots
export const businessHotspots: BusinessZone[] = [
  { id: '1', name: 'Financial Hub', footTraffic: 125000, profitability: 98, growthRate: 12.5, businessCount: 847 },
  { id: '2', name: 'Downtown Core', footTraffic: 98000, profitability: 94, growthRate: 8.2, businessCount: 1234 },
  { id: '3', name: 'Shopping District', footTraffic: 87000, profitability: 91, growthRate: 15.7, businessCount: 562 },
  { id: '4', name: 'Tech District', footTraffic: 65000, profitability: 89, growthRate: 22.3, businessCount: 328 },
  { id: '5', name: 'Harbor Front', footTraffic: 54000, profitability: 85, growthRate: 18.1, businessCount: 276 },
];

// Crowd Forecast Data (24 hours)
export const crowdForecastData: CrowdForecast[] = [
  { hour: '00:00', predicted: 15, actual: 14, zone: 'Downtown' },
  { hour: '02:00', predicted: 8, actual: 9, zone: 'Downtown' },
  { hour: '04:00', predicted: 5, actual: 4, zone: 'Downtown' },
  { hour: '06:00', predicted: 12, actual: 15, zone: 'Downtown' },
  { hour: '08:00', predicted: 45, actual: 52, zone: 'Downtown' },
  { hour: '10:00', predicted: 68, actual: 65, zone: 'Downtown' },
  { hour: '12:00', predicted: 85, actual: 88, zone: 'Downtown' },
  { hour: '14:00', predicted: 78, actual: 75, zone: 'Downtown' },
  { hour: '16:00', predicted: 82, actual: 80, zone: 'Downtown' },
  { hour: '18:00', predicted: 92, actual: 95, zone: 'Downtown' },
  { hour: '20:00', predicted: 75, actual: 72, zone: 'Downtown' },
  { hour: '22:00', predicted: 45, actual: 48, zone: 'Downtown' },
];

// Safety Trends (Last 7 days)
export const safetyTrendData: SafetyTrend[] = [
  { date: 'Mon', score: 88, incidents: 12 },
  { date: 'Tue', score: 91, incidents: 8 },
  { date: 'Wed', score: 85, incidents: 15 },
  { date: 'Thu', score: 92, incidents: 6 },
  { date: 'Fri', score: 87, incidents: 14 },
  { date: 'Sat', score: 78, incidents: 22 },
  { date: 'Sun', score: 94, incidents: 5 },
];

// Traffic Data by Hour
export const trafficData = [
  { hour: '06:00', intensity: 25 },
  { hour: '07:00', intensity: 45 },
  { hour: '08:00', intensity: 78 },
  { hour: '09:00', intensity: 85 },
  { hour: '10:00', intensity: 65 },
  { hour: '11:00', intensity: 58 },
  { hour: '12:00', intensity: 72 },
  { hour: '13:00', intensity: 68 },
  { hour: '14:00', intensity: 55 },
  { hour: '15:00', intensity: 62 },
  { hour: '16:00', intensity: 75 },
  { hour: '17:00', intensity: 92 },
  { hour: '18:00', intensity: 88 },
  { hour: '19:00', intensity: 65 },
  { hour: '20:00', intensity: 45 },
  { hour: '21:00', intensity: 32 },
];
