
import { Play, Square, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import type { Agent } from '../../types';

interface AgentCardProps {
  agent: Agent;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
}

export function AgentCard({ agent, onStart, onStop }: AgentCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    error: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn('h-3 w-3 rounded-full', statusColors[agent.status])} />
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{agent.type}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {agent.status === 'active' ? (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onStop(agent.id)}
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onStart(agent.id)}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agent.currentTask && (
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Current Task
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {agent.currentTask}
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-lg font-semibold">{agent.metrics.tasksCompleted}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">In Progress</p>
              <p className="text-lg font-semibold">{agent.metrics.tasksInProgress}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Failed</p>
              <p className="text-lg font-semibold text-red-600">
                {agent.metrics.tasksFailed}
              </p>
            </div>
          </div>

          {agent.metrics.cpuUsage !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">CPU Usage</span>
                <span className="font-medium">{agent.metrics.cpuUsage}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-primary-600"
                  style={{ width: `${agent.metrics.cpuUsage}%` }}
                />
              </div>
            </div>
          )}

          {agent.metrics.memoryUsage !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Memory Usage</span>
                <span className="font-medium">{agent.metrics.memoryUsage}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-accent-600"
                  style={{ width: `${agent.metrics.memoryUsage}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last activity: {new Date(agent.metrics.lastActivity).toLocaleString()}</span>
            <Activity className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
