/**
 * Agents Dashboard Page
 * Real-time agent monitoring and management
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Play, Pause, RefreshCw, Trash2, Plus } from 'lucide-react';
import { useAgents } from '../hooks/useData';
import { apiClient } from '../services/api';
import { Card, LoadingSpinner, ErrorMessage, StatusBadge, Table, EmptyState } from '../components/common';
import { Agent, AgentStatus, AgentType } from '../types';
import { format } from 'date-fns';

export const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  const { data: agents, loading, error, refetch } = useAgents(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const filteredAgents = React.useMemo(() => {
    if (!agents) return [];
    if (typeFilter === 'all') return agents;
    return agents.filter(agent => agent.type === typeFilter);
  }, [agents, typeFilter]);

  const handleRestart = async (id: string) => {
    try {
      await apiClient.restartAgent(id);
      refetch();
    } catch (error) {
      console.error('Failed to restart agent:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;
    try {
      await apiClient.deleteAgent(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
          <p className="mt-2 text-gray-600">Manage and monitor your AI agents</p>
        </div>
        <button
          onClick={() => navigate('/agents/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Agent
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents?.length || 0}</p>
            </div>
            <Bot className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600">
                {agents?.filter(a => a.status === AgentStatus.ONLINE).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Busy</p>
              <p className="text-2xl font-bold text-yellow-600">
                {agents?.filter(a => a.status === AgentStatus.BUSY).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-red-600">
                {agents?.filter(a => a.status === AgentStatus.OFFLINE).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value={AgentStatus.ONLINE}>Online</option>
              <option value={AgentStatus.OFFLINE}>Offline</option>
              <option value={AgentStatus.BUSY}>Busy</option>
              <option value={AgentStatus.ERROR}>Error</option>
              <option value={AgentStatus.MAINTENANCE}>Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value={AgentType.ORCHESTRATOR}>Orchestrator</option>
              <option value={AgentType.WORKER}>Worker</option>
              <option value={AgentType.MONITOR}>Monitor</option>
              <option value={AgentType.COORDINATOR}>Coordinator</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={refetch} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </Card>

      {/* Agents Table */}
      <Card>
        {filteredAgents.length === 0 ? (
          <EmptyState
            icon={<Bot className="h-12 w-12 text-gray-400" />}
            title="No agents found"
            description="Get started by adding your first agent"
            action={{
              label: 'Add Agent',
              onClick: () => navigate('/agents/new'),
            }}
          />
        ) : (
          <Table
            data={filteredAgents}
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (agent: Agent) => (
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.id}</p>
                  </div>
                ),
              },
              {
                key: 'type',
                header: 'Type',
                render: (agent: Agent) => (
                  <span className="badge bg-gray-100 text-gray-800">{agent.type}</span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (agent: Agent) => <StatusBadge status={agent.status} />,
              },
              {
                key: 'metrics',
                header: 'Performance',
                render: (agent: Agent) => (
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">CPU:</span>
                      <span className="font-medium">{agent.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Mem:</span>
                      <span className="font-medium">{agent.memoryUsage.toFixed(1)}%</span>
                    </div>
                  </div>
                ),
              },
              {
                key: 'tasks',
                header: 'Tasks',
                render: (agent: Agent) => (
                  <div className="text-sm">
                    <div>Active: <span className="font-medium">{agent.tasksActive}</span></div>
                    <div>Completed: <span className="font-medium">{agent.tasksCompleted}</span></div>
                  </div>
                ),
              },
              {
                key: 'lastHeartbeat',
                header: 'Last Seen',
                render: (agent: Agent) => (
                  <span className="text-sm text-gray-600">
                    {format(new Date(agent.lastHeartbeat), 'MMM dd, HH:mm')}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (agent: Agent) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRestart(agent.id)}
                      className="p-1 text-primary-600 hover:text-primary-700"
                      title="Restart"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            onRowClick={(agent) => navigate(`/agents/${agent.id}`)}
          />
        )}
      </Card>
    </div>
  );
};
