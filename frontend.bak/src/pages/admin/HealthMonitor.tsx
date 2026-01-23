
import React, { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive, DollarSign } from 'lucide-react';

export default function HealthMonitor() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await fetch('/api/admin/health');
      const data = await res.json();
      setMetrics(data);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div className="text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#020410] p-4">
      <h1 className="text-4xl font-bold text-[#39FF14] mb-8 font-['Orbitron']">
        System Health
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Activity />}
          title="Error Rate"
          value={`${(metrics.error_rate * 100).toFixed(2)}%`}
          color="#39FF14"
        />
        <MetricCard
          icon={<Cpu />}
          title="CPU Usage"
          value={`${metrics.cpu_percent.toFixed(1)}%`}
          color="#0066FF"
        />
        <MetricCard
          icon={<HardDrive />}
          title="Memory"
          value={`${metrics.memory_percent.toFixed(1)}%`}
          color="#39FF14"
        />
        <MetricCard
          icon={<DollarSign />}
          title="Cost Today"
          value={`$${metrics.cost_today_usd.toFixed(2)}`}
          color="#0066FF"
        />
      </div>
      
      <div className="mt-8 bg-[#0a1628]/60 backdrop-blur-xl border border-[#39FF14]/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">24h Activity</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-bold text-[#39FF14]">{metrics.completed_tasks_24h}</div>
            <div className="text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#0066FF]">{metrics.active_tasks}</div>
            <div className="text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-400">{metrics.failed_tasks_24h}</div>
            <div className="text-gray-400">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, color }: any) {
  return (
    <div className="bg-[#0a1628]/60 backdrop-blur-xl border border-[#39FF14]/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-2" style={{ color }}>
        {icon}
        <span className="text-gray-400">{title}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}
