
import React, { useEffect, useState } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';

export default function ApprovalQueue() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const res = await fetch('/api/admin/approvals');
      const data = await res.json();
      setApprovals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/approvals/${id}/approve`, { method: 'POST' });
    fetchApprovals();
  };

  const handleReject = async (id: string) => {
    await fetch(`/api/admin/approvals/${id}/reject`, { method: 'POST' });
    fetchApprovals();
  };

  return (
    <div className="min-h-screen bg-[#020410] p-4">
      <h1 className="text-4xl font-bold text-[#39FF14] mb-8 font-['Orbitron']">
        Approval Queue
      </h1>
      
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : approvals.length === 0 ? (
        <div className="text-white">No pending approvals</div>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="bg-[#0a1628]/60 backdrop-blur-xl border border-[#39FF14]/20 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">{approval.title}</h2>
                  <p className="text-gray-400 mt-2">{approval.description}</p>
                  <div className="mt-4 flex gap-4 text-sm">
                    <span className="text-[#39FF14]">+{approval.additions} additions</span>
                    <span className="text-red-400">-{approval.deletions} deletions</span>
                    <span className="text-gray-400">{approval.files_changed} files</span>
                  </div>
                </div>
                <a href={approval.diff_url} target="_blank" rel="noopener noreferrer" className="text-[#0066FF]">
                  <ExternalLink size={20} />
                </a>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => handleApprove(approval.id)}
                  className="flex items-center gap-2 bg-[#39FF14] text-[#020410] font-bold px-6 py-2 rounded"
                >
                  <Check size={20} /> Approve
                </button>
                <button
                  onClick={() => handleReject(approval.id)}
                  className="flex items-center gap-2 bg-red-500 text-white font-bold px-6 py-2 rounded"
                >
                  <X size={20} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
