
import { Activity, Cpu, HardDrive, Network } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { SystemMetrics } from '../../types';

interface SystemMetricsProps {
  metrics: SystemMetrics;
}

export function SystemMetricsCard({ metrics }: SystemMetricsProps) {
  const metricsData = [
    {
      label: 'CPU Usage',
      value: metrics.cpuUsage,
      unit: '%',
      icon: Cpu,
      color: 'text-blue-600',
    },
    {
      label: 'Memory',
      value: metrics.memoryUsage,
      unit: '%',
      icon: Activity,
      color: 'text-green-600',
    },
    {
      label: 'Disk',
      value: metrics.diskUsage,
      unit: '%',
      icon: HardDrive,
      color: 'text-purple-600',
    },
    {
      label: 'Network',
      value: metrics.activeConnections,
      unit: ' conn',
      icon: Network,
      color: 'text-orange-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metricsData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={cn('h-4 w-4', item.color)} />
                    <span className="text-sm text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-lg font-semibold">
                    {item.value}
                    {item.unit}
                  </span>
                </div>
                {item.unit === '%' && (
                  <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        item.value > 80
                          ? 'bg-red-500'
                          : item.value > 60
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      )}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Network In/Out</span>
            <span className="font-medium">
              {(metrics.networkIn / 1024).toFixed(2)} / {(metrics.networkOut / 1024).toFixed(2)} MB/s
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
