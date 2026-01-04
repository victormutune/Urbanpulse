import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { CityHealthScore } from '@/components/dashboard/CityHealthScore';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { CrowdChart } from '@/components/dashboard/CrowdChart';
import { ZoneGrid } from '@/components/dashboard/ZoneGrid';
import { TrafficChart } from '@/components/dashboard/TrafficChart';
import { cityMetrics, activeAlerts, cityZones } from '@/data/mockData';
import { Activity, Users, Shield, Car, AlertTriangle, Building2 } from 'lucide-react';

const Index = () => {
  return (
    <Layout title="City Command Center" subtitle="Real-time urban intelligence dashboard">
      <div className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="City Health"
            value={cityMetrics.healthScore}
            suffix="%"
            icon={<Activity className="w-5 h-5" />}
            trend={{ value: 2.3, isPositive: true }}
            variant="cyan"
            delay={0}
          />
          <StatCard
            title="Crowd Index"
            value={cityMetrics.crowdIndex}
            suffix="%"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 5.1, isPositive: false }}
            variant="magenta"
            delay={0.1}
          />
          <StatCard
            title="Safety Index"
            value={cityMetrics.safetyIndex}
            suffix="%"
            icon={<Shield className="w-5 h-5" />}
            trend={{ value: 1.8, isPositive: true }}
            variant="success"
            delay={0.2}
          />
          <StatCard
            title="Traffic"
            value={cityMetrics.trafficIntensity}
            suffix="%"
            icon={<Car className="w-5 h-5" />}
            trend={{ value: 8.4, isPositive: false }}
            variant="warning"
            delay={0.3}
          />
          <StatCard
            title="Active Alerts"
            value={cityMetrics.activeAlerts}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="danger"
            delay={0.4}
          />
          <StatCard
            title="Population"
            value={Math.round(cityMetrics.population / 1000)}
            suffix="K"
            icon={<Building2 className="w-5 h-5" />}
            variant="cyan"
            delay={0.5}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <CrowdChart />
            <TrafficChart />
            <ZoneGrid zones={cityZones} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CityHealthScore score={cityMetrics.healthScore} />
            <AlertsPanel alerts={activeAlerts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
