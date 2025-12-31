/**
 * Proof Logs Page
 * View and export cryptographic proof logs
 */

import React, { useState } from 'react';
import { Shield, Download, CheckCircle, XCircle } from 'lucide-react';
import { useProofLogs } from '../hooks/useData';
import { apiClient } from '../services/api';
import { Card, LoadingSpinner, ErrorMessage, StatusBadge, Table, Pagination, Modal } from '../components/common';
import { ProofLog, ProofStatus, ProofExportOptions } from '../types';
import { format } from 'date-fns';

export const ProofLogsPage: React.FC = () => {
  const [workflowFilter, setWorkflowFilter] = useState<string>('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState<ProofLog | null>(null);
  
  const { data: proofs, total, page, setPage, pageSize, loading, error, refetch } = useProofLogs(
    workflowFilter ? { workflowId: workflowFilter } : undefined
  );

  const handleExport = async (options: ProofExportOptions) => {
    try {
      const blob = await apiClient.exportProofs(options);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proof-logs-${new Date().toISOString()}.${options.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setShowExportModal(false);
    } catch (error) {
      console.error('Failed to export proofs:', error);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      await apiClient.verifyProof(id);
      refetch();
    } catch (error) {
      console.error('Failed to verify proof:', error);
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
          <h1 className="text-3xl font-bold text-gray-900">Proof Logs</h1>
          <p className="mt-2 text-gray-600">Cryptographic verification and audit trails</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Proofs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proofs</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {proofs?.filter(p => p.status === ProofStatus.VERIFIED).length || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {proofs?.filter(p => p.status === ProofStatus.PENDING).length || 0}
              </p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {proofs?.filter(p => p.status === ProofStatus.FAILED).length || 0}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Workflow</label>
            <input
              type="text"
              placeholder="Workflow ID..."
              value={workflowFilter}
              onChange={(e) => setWorkflowFilter(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </Card>

      {/* Proofs Table */}
      <Card>
        <Table
          data={proofs || []}
          columns={[
            {
              key: 'timestamp',
              header: 'Time',
              render: (proof: ProofLog) => (
                <span className="text-sm text-gray-600">
                  {format(new Date(proof.timestamp), 'MMM dd, HH:mm:ss')}
                </span>
              ),
            },
            {
              key: 'workflow',
              header: 'Workflow',
              render: (proof: ProofLog) => (
                <div>
                  <p className="font-medium text-gray-900">{proof.workflowName}</p>
                  <p className="text-xs text-gray-500 font-mono">{proof.workflowId.substring(0, 8)}...</p>
                </div>
              ),
            },
            {
              key: 'agent',
              header: 'Agent',
              render: (proof: ProofLog) => (
                <div>
                  <p className="font-medium text-gray-900">{proof.agentName}</p>
                  <p className="text-xs text-gray-500 font-mono">{proof.agentId.substring(0, 8)}...</p>
                </div>
              ),
            },
            {
              key: 'type',
              header: 'Type',
              render: (proof: ProofLog) => (
                <span className="badge bg-purple-100 text-purple-800">{proof.proofType}</span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (proof: ProofLog) => <StatusBadge status={proof.status} />,
            },
            {
              key: 'hash',
              header: 'Hash',
              render: (proof: ProofLog) => (
                <span className="text-xs text-gray-600 font-mono">
                  {proof.hash.substring(0, 12)}...
                </span>
              ),
            },
            {
              key: 'verified',
              header: 'Verification',
              render: (proof: ProofLog) => (
                <div className="text-xs">
                  {proof.verificationDetails.isValid ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (proof: ProofLog) => (
                <div className="flex gap-2">
                  {proof.status === ProofStatus.PENDING && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerify(proof.id);
                      }}
                      className="text-xs btn-primary py-1 px-2"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProof(proof);
                    }}
                    className="text-xs btn-secondary py-1 px-2"
                  >
                    Details
                  </button>
                </div>
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

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Proof Logs"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setShowExportModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={() => handleExport({
                format: 'json',
                includeMetadata: true,
              })}
              className="btn-primary"
            >
              Export as JSON
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Export proof logs for archival, compliance, or external verification purposes.
          </p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Include metadata</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Include verification details</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Proof Details Modal */}
      {selectedProof && (
        <Modal
          isOpen={!!selectedProof}
          onClose={() => setSelectedProof(null)}
          title="Proof Details"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Proof ID</label>
              <p className="text-sm text-gray-900 font-mono">{selectedProof.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Hash</label>
              <p className="text-sm text-gray-900 font-mono break-all">{selectedProof.hash}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Signature</label>
              <p className="text-sm text-gray-900 font-mono break-all">{selectedProof.signature}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Verification Method</label>
              <p className="text-sm text-gray-900">{selectedProof.verificationDetails.verificationMethod}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Data</label>
              <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48">
                {JSON.stringify(selectedProof.data, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
