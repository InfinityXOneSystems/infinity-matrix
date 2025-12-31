import os from 'os';
import type { SystemStatus, SystemMetrics, ServiceStatus } from '../types';

class SystemService {
  getSystemStatus(): SystemStatus {
    const metrics = this.getSystemMetrics();
    const services = this.getServiceStatuses();
    
    return {
      status: this.calculateOverallStatus(metrics, services),
      services,
      metrics,
      alerts: [],
    };
  }

  getSystemMetrics(): SystemMetrics {
    const cpus = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;

    // Calculate CPU usage (simplified)
    const cpuUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpus.length;

    return {
      cpuUsage: Math.round(cpuUsage * 10) / 10,
      memoryUsage: Math.round((usedMemory / totalMemory) * 100 * 10) / 10,
      diskUsage: Math.random() * 60 + 20, // Placeholder
      networkIn: Math.random() * 1000,
      networkOut: Math.random() * 1000,
      activeConnections: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date(),
    };
  }

  getServiceStatuses(): ServiceStatus[] {
    return [
      {
        name: 'API Server',
        status: 'running',
        uptime: process.uptime(),
        lastCheck: new Date(),
      },
      {
        name: 'WebSocket Server',
        status: 'running',
        uptime: process.uptime(),
        lastCheck: new Date(),
      },
      {
        name: 'Agent Manager',
        status: 'running',
        uptime: process.uptime(),
        lastCheck: new Date(),
      },
      {
        name: 'AI Service',
        status: 'running',
        uptime: process.uptime(),
        lastCheck: new Date(),
      },
    ];
  }

  private calculateOverallStatus(
    metrics: SystemMetrics,
    services: ServiceStatus[]
  ): 'healthy' | 'degraded' | 'down' {
    const hasFailedService = services.some((s) => s.status === 'error' || s.status === 'stopped');
    
    if (hasFailedService) {
      return 'down';
    }

    if (metrics.cpuUsage > 80 || metrics.memoryUsage > 85) {
      return 'degraded';
    }

    return 'healthy';
  }
}

export const systemService = new SystemService();
