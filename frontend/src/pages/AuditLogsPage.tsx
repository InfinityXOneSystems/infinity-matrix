/**
 * Audit Logs Page
 * View and filter system audit logs
 */

import React, { useState } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { useAuditLogs } from '../hooks/useData';
import { apiClient } from '../services/api';
import { Card, LoadingSpinner, ErrorMessage, StatusBadge, Table, Pagination } from '../components/common';
import { AuditLog, AuditAction, AuditSeverity, AuditFilters } from '../types';
import { format } from 'date-fns';

export const AuditLogsPage: React.FC = () => {
  const [filters, setFilters] = useState<AuditFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: logs, total, page, setPage, pageSize, loading, error, refetch } = useAuditLogs(filters);

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const blob = await apiClient.exportAuditLogs(filters, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export logs:', error);
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-2 text-gray-600">Track all system activity and user actions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={() => handleExport('json')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success</p>
              <p className="text-2xl font-bold text-green-600">
                {logs?.filter(l => l.outcome === 'success').length || 0}
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
                {logs?.filter(l => l.outcome === 'failure').length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-orange-600">
                {logs?.filter(l => l.severity === AuditSeverity.CRITICAL).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-orange-500 rounded-full" />
          </div>
        </Card>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={filters.action || ''}
                onChange={(e) => setFilters({ ...filters, action: e.target.value as AuditAction || undefined })}
                className="input-field"
              >
                <option value="">All Actions</option>
                {Object.values(AuditAction).map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                value={filters.severity || ''}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value as AuditSeverity || undefined })}
                className="input-field"
              >
                <option value="">All Severities</option>
                {Object.values(AuditSeverity).map(severity => (
                  <option key={severity} value={severity}>{severity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
              <select
                value={filters.outcome || ''}
                onChange={(e) => setFilters({ ...filters, outcome: e.target.value as any || undefined })}
                className="input-field"
              >
                <option value="">All Outcomes</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search logs..."
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value || undefined })}
                className="input-field"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={refetch} className="btn-primary">Apply Filters</button>
            <button onClick={() => setFilters({})} className="btn-secondary">Clear Filters</button>
          </div>
        </Card>
      )}

      {/* Logs Table */}
      <Card>
        <Table
          data={logs || []}
          columns={[
            {
              key: 'timestamp',
              header: 'Time',
              render: (log: AuditLog) => (
                <span className="text-sm text-gray-600">
                  {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                </span>
              ),
            },
            {
              key: 'user',
              header: 'User',
              render: (log: AuditLog) => (
                <div>
                  <p className="font-medium text-gray-900">{log.userName}</p>
                  <p className="text-xs text-gray-500">{log.userId}</p>
                </div>
              ),
            },
            {
              key: 'action',
              header: 'Action',
              render: (log: AuditLog) => (
                <span className="badge bg-blue-100 text-blue-800">{log.action}</span>
              ),
            },
            {
              key: 'resource',
              header: 'Resource',
              render: (log: AuditLog) => (
                <div>
                  <p className="font-medium text-gray-900">{log.resource}</p>
                  <p className="text-xs text-gray-500">{log.resourceId}</p>
                </div>
              ),
            },
            {
              key: 'severity',
              header: 'Severity',
              render: (log: AuditLog) => {
                const severityColors = {
                  [AuditSeverity.INFO]: 'badge-info',
                  [AuditSeverity.WARNING]: 'badge-warning',
                  [AuditSeverity.ERROR]: 'badge-error',
                  [AuditSeverity.CRITICAL]: 'bg-red-600 text-white',
                };
                return (
                  <span className={`badge ${severityColors[log.severity]}`}>
                    {log.severity}
                  </span>
                );
              },
            },
            {
              key: 'outcome',
              header: 'Outcome',
              render: (log: AuditLog) => (
                <StatusBadge
                  status={log.outcome}
                  variant={log.outcome === 'success' ? 'success' : 'error'}
                />
              ),
            },
            {
              key: 'ipAddress',
              header: 'IP Address',
              render: (log: AuditLog) => (
                <span className="text-sm text-gray-600 font-mono">{log.ipAddress}</span>
              ),
            },
          ]}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </Card>
    </div>
  );
};
