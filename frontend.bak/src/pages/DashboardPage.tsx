import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Activity, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { SystemMetricsCard } from '../components/admin/SystemMetricsCard';
import { adminService } from '../services/adminService';
import { useSystemStore } from '../store/systemStore';

export function DashboardPage() {
  const { agents, systemStatus } = useSystemStore();

  const { data: agentsData, isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: adminService.getAgents,
    refetchInterval: 5000,
  });

  const { data: statusData } = useQuery({
    queryKey: ['system-status'],
    queryFn: adminService.getSystemStatus,
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (agentsData) {
      useSystemStore.getState().setAgents(agentsData);
    }
  }, [agentsData]);

  useEffect(() => {
    if (statusData) {
      useSystemStore.getState().setSystemStatus(statusData);
    }
  }, [statusData]);

  const stats = [
    {
      title: 'Total Agents',
      value: agents.length,
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Agents',
      value: agents.filter((a) => a.status === 'active').length,
      change: '+8%',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Tasks Completed',
      value: agents.reduce((sum, a) => sum + a.metrics.tasksCompleted, 0),
      change: '+23%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Data Sources',
      value: 12,
      change: '+4',
      icon: Database,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage your intelligence system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {systemStatus?.metrics && (
          <SystemMetricsCard metrics={systemStatus.metrics} />
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest agent and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents.slice(0, 5).map((agent) => (
                <div key={agent.id} className="flex items-center space-x-3">
                  <div className={`h-2 w-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' :
                    agent.status === 'idle' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-gray-500">
                      {agent.currentTask || 'Idle'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(agent.metrics.lastActivity).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {systemStatus?.alerts && systemStatus.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemStatus.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg p-4 ${
                    alert.severity === 'critical' ? 'bg-red-50 dark:bg-red-900/20' :
                    alert.severity === 'error' ? 'bg-orange-50 dark:bg-orange-900/20' :
                    alert.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                    'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {alert.source} • {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                      alert.severity === 'error' ? 'bg-orange-200 text-orange-800' :
                      alert.severity === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
