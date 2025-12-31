/**
 * Workflows Page
 * Workflow management and monitoring
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Workflow as WorkflowIcon, Play, Pause, StopCircle, Plus, RefreshCw } from 'lucide-react';
import { useWorkflows } from '../hooks/useData';
import { apiClient } from '../services/api';
import { Card, LoadingSpinner, ErrorMessage, StatusBadge, Table, EmptyState } from '../components/common';
import { Workflow, WorkflowStatus } from '../types';
import { format } from 'date-fns';

export const WorkflowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: workflows, total, page, setPage, loading, error, refetch } = useWorkflows(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const handleStart = async (id: string) => {
    try {
      await apiClient.startWorkflow(id);
      refetch();
    } catch (error) {
      console.error('Failed to start workflow:', error);
    }
  };

  const handlePause = async (id: string) => {
    try {
      await apiClient.pauseWorkflow(id);
      refetch();
    } catch (error) {
      console.error('Failed to pause workflow:', error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this workflow?')) return;
    try {
      await apiClient.cancelWorkflow(id);
      refetch();
    } catch (error) {
      console.error('Failed to cancel workflow:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="mt-2 text-gray-600">Manage and monitor your workflows</p>
        </div>
        <button
          onClick={() => navigate('/workflows/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <WorkflowIcon className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Running</p>
              <p className="text-2xl font-bold text-blue-600">
                {workflows?.filter(w => w.status === WorkflowStatus.RUNNING).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {workflows?.filter(w => w.status === WorkflowStatus.COMPLETED).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {workflows?.filter(w => w.status === WorkflowStatus.FAILED).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value={WorkflowStatus.PENDING}>Pending</option>
              <option value={WorkflowStatus.RUNNING}>Running</option>
              <option value={WorkflowStatus.COMPLETED}>Completed</option>
              <option value={WorkflowStatus.FAILED}>Failed</option>
              <option value={WorkflowStatus.PAUSED}>Paused</option>
              <option value={WorkflowStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
          <button onClick={refetch} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </Card>

      {/* Workflows Table */}
      <Card>
        {workflows && workflows.length === 0 ? (
          <EmptyState
            icon={<WorkflowIcon className="h-12 w-12 text-gray-400" />}
            title="No workflows found"
            description="Get started by creating your first workflow"
            action={{
              label: 'Create Workflow',
              onClick: () => navigate('/workflows/new'),
            }}
          />
        ) : (
          <Table
            data={workflows || []}
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (workflow: Workflow) => (
                  <div>
                    <p className="font-medium text-gray-900">{workflow.name}</p>
                    <p className="text-xs text-gray-500">{workflow.description}</p>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (workflow: Workflow) => <StatusBadge status={workflow.status} />,
              },
              {
                key: 'progress',
                header: 'Progress',
                render: (workflow: Workflow) => (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        Step {workflow.currentStepIndex + 1}/{workflow.steps.length}
                      </span>
                      <span className="text-xs font-medium text-gray-900">{workflow.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                key: 'duration',
                header: 'Duration',
                render: (workflow: Workflow) => {
                  if (!workflow.startedAt) return <span className="text-gray-400">-</span>;
                  const start = new Date(workflow.startedAt);
                  const end = workflow.completedAt ? new Date(workflow.completedAt) : new Date();
                  const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
                  const minutes = Math.floor(duration / 60);
                  const seconds = duration % 60;
                  return <span className="text-sm text-gray-600">{minutes}m {seconds}s</span>;
                },
              },
              {
                key: 'createdAt',
                header: 'Created',
                render: (workflow: Workflow) => (
                  <span className="text-sm text-gray-600">
                    {format(new Date(workflow.createdAt), 'MMM dd, HH:mm')}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Actions',
                render: (workflow: Workflow) => (
                  <div className="flex items-center gap-2">
                    {workflow.status === WorkflowStatus.PENDING && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStart(workflow.id);
                        }}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Start"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    {workflow.status === WorkflowStatus.RUNNING && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePause(workflow.id);
                          }}
                          className="p-1 text-yellow-600 hover:text-yellow-700"
                          title="Pause"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancel(workflow.id);
                          }}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Cancel"
                        >
                          <StopCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {workflow.status === WorkflowStatus.PAUSED && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStart(workflow.id);
                        }}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Resume"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            onRowClick={(workflow) => navigate(`/workflows/${workflow.id}`)}
          />
        )}
      </Card>
    </div>
  );
};
