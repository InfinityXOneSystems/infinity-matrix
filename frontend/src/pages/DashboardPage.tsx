/**
 * Main Dashboard Page
 * Overview of system stats, agent health, and recent activity
 */

import React from 'react';
import { Activity, Bot, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { useDashboardStats, useAgents, useWorkflows } from '../hooks/useData';
import { StatCard, LoadingSpinner, ErrorMessage, Card } from '../components/common';
import { AgentStatus, WorkflowStatus } from '../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const { data: stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: agents, loading: agentsLoading } = useAgents();
  const { data: workflows } = useWorkflows({ status: WorkflowStatus.RUNNING });

  if (statsLoading || agentsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError) {
    return <ErrorMessage message={statsError.message} />;
  }

  const onlineAgents = agents?.filter(a => a.status === AgentStatus.ONLINE).length || 0;
  const runningWorkflows = workflows?.length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your InfinityX AI admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Agents"
          value={stats?.totalAgents || 0}
          subtitle={`${onlineAgents} online`}
          icon={<Bot className="h-6 w-6 text-primary-600" />}
        />
        <StatCard
          title="Active Workflows"
          value={stats?.runningWorkflows || 0}
          subtitle={`${stats?.totalWorkflows || 0} total`}
          icon={<Activity className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Completed Today"
          value={stats?.completedWorkflows || 0}
          subtitle="Workflows"
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatCard
          title="System Health"
          value={`${stats?.systemHealth || 100}%`}
          subtitle="All systems operational"
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agents */}
        <Card title="Agent Status" subtitle="Real-time agent monitoring">
          <div className="space-y-3">
            {agents?.slice(0, 5).map((agent) => (
              <Link
                key={agent.id}
                to={`/agents/${agent.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      agent.status === AgentStatus.ONLINE
                        ? 'bg-green-500'
                        : agent.status === AgentStatus.BUSY
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-500">{agent.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{agent.tasksActive} active</p>
                  <p className="text-xs text-gray-500">{agent.tasksCompleted} completed</p>
                </div>
              </Link>
            ))}
            {(!agents || agents.length === 0) && (
              <p className="text-center text-gray-500 py-4">No agents available</p>
            )}
            <Link
              to="/agents"
              className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium pt-2"
            >
              View all agents →
            </Link>
          </div>
        </Card>

        {/* Recent Workflows */}
        <Card title="Active Workflows" subtitle="Currently running workflows">
          <div className="space-y-3">
            {workflows?.slice(0, 5).map((workflow) => (
              <Link
                key={workflow.id}
                to={`/workflows/${workflow.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{workflow.name}</p>
                  <p className="text-sm text-gray-500">
                    Step {workflow.currentStepIndex + 1} of {workflow.steps.length}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${workflow.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{workflow.progress}%</p>
                </div>
              </Link>
            ))}
            {(!workflows || workflows.length === 0) && (
              <p className="text-center text-gray-500 py-4">No active workflows</p>
            )}
            <Link
              to="/workflows"
              className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium pt-2"
            >
              View all workflows →
            </Link>
          </div>
        </Card>

        {/* System Alerts */}
        <Card title="Recent Alerts" subtitle="System notifications">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">High CPU Usage</p>
                <p className="text-xs text-yellow-700 mt-1">Agent worker-03 at 85%</p>
                <p className="text-xs text-yellow-600 mt-1">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Workflow Completed</p>
                <p className="text-xs text-green-700 mt-1">Data processing pipeline finished</p>
                <p className="text-xs text-green-600 mt-1">12 minutes ago</p>
              </div>
            </div>
            <Link
              to="/audit"
              className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium pt-2"
            >
              View all activity →
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Common operations">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/workflows/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <Activity className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">New Workflow</p>
            </Link>
            <Link
              to="/agents/new"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <Bot className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Add Agent</p>
            </Link>
            <Link
              to="/audit"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <Clock className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">View Logs</p>
            </Link>
            <Link
              to="/proofs"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
            >
              <CheckCircle className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Proof Logs</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
