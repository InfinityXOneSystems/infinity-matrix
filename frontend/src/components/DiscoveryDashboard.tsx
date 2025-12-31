import React, { useState, useEffect } from 'react';
import { discoveryService } from '../services/api';
import './DiscoveryDashboard.css';

interface Discovery {
  id: number;
  client_name: string;
  business_name: string;
  status: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}

const DiscoveryDashboard: React.FC = () => {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [selectedDiscovery, setSelectedDiscovery] = useState<number | null>(null);

  useEffect(() => {
    loadDiscoveries();
  }, []);

  const loadDiscoveries = async () => {
    try {
      setLoading(true);
      const data = await discoveryService.listDiscoveries();
      setDiscoveries(data);
    } catch (err) {
      setError('Failed to load discoveries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startDiscovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim() || !businessName.trim()) {
      setError('Both client name and business name are required');
      return;
    }

    try {
      setLoading(true);
      const discovery = await discoveryService.startDiscovery(clientName, businessName);
      setDiscoveries([discovery, ...discoveries]);
      setClientName('');
      setBusinessName('');
      setError('');
      
      // Poll for updates
      setTimeout(() => pollDiscoveryStatus(discovery.id), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to start discovery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pollDiscoveryStatus = async (id: number) => {
    try {
      const discovery = await discoveryService.getDiscovery(id);
      setDiscoveries(prev => 
        prev.map(d => d.id === id ? discovery : d)
      );
      
      // Continue polling if in progress
      if (discovery.status === 'in_progress' || discovery.status === 'pending') {
        setTimeout(() => pollDiscoveryStatus(id), 5000);
      }
    } catch (err) {
      console.error('Failed to poll discovery status:', err);
    }
  };

  const viewDiscoveryPack = async (id: number) => {
    setSelectedDiscovery(id);
    // In a real app, this would navigate to a detailed view
    try {
      const pack = await discoveryService.getCompletePack(id);
      console.log('Complete discovery pack:', pack);
      alert('Discovery pack loaded! Check console for details.');
    } catch (err) {
      console.error('Failed to load discovery pack:', err);
      alert('Failed to load discovery pack. The discovery may not be complete yet.');
    }
  };

  const getStatusClass = (status: string) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="discovery-dashboard">
      <div className="card">
        <h2>🚀 Start New Intelligence Discovery</h2>
        <p className="description">
          Enter a client name and business name to automatically discover and analyze 
          comprehensive business intelligence, competitive landscape, and strategic opportunities.
        </p>

        <form onSubmit={startDiscovery} className="discovery-form">
          <div className="form-group">
            <label className="label">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., John Smith"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., Acme Corporation"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading"></span> Processing...
              </>
            ) : (
              'Start Discovery'
            )}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>📊 Discovery Sessions</h2>
        
        {discoveries.length === 0 ? (
          <p className="empty-state">No discoveries yet. Start your first one above!</p>
        ) : (
          <div className="discoveries-list">
            {discoveries.map((discovery) => (
              <div key={discovery.id} className="discovery-item">
                <div className="discovery-header">
                  <div>
                    <h3>{discovery.business_name}</h3>
                    <p className="client-name">Client: {discovery.client_name}</p>
                  </div>
                  <span className={getStatusClass(discovery.status)}>
                    {discovery.status}
                  </span>
                </div>
                
                <div className="discovery-meta">
                  <span>Created: {formatDate(discovery.created_at)}</span>
                  {discovery.completed_at && (
                    <span>Completed: {formatDate(discovery.completed_at)}</span>
                  )}
                </div>

                {discovery.status === 'completed' && (
                  <button
                    className="button view-button"
                    onClick={() => viewDiscoveryPack(discovery.id)}
                  >
                    View Complete Discovery Pack
                  </button>
                )}

                {discovery.status === 'in_progress' && (
                  <div className="progress-indicator">
                    <span className="loading"></span>
                    <span>Analyzing intelligence...</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card features-card">
        <h2>✨ What We Discover</h2>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🔍</span>
            <h3>Business Intelligence</h3>
            <p>Deep analysis of business model, operations, and capabilities</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚔️</span>
            <h3>Competitive Analysis</h3>
            <p>Comprehensive competitor landscape and positioning</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📈</span>
            <h3>Market Insights</h3>
            <p>Market trends, consensus, and demand drivers</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💡</span>
            <h3>Opportunities</h3>
            <p>Gap detection and strategic opportunity identification</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📝</span>
            <h3>AI Proposals</h3>
            <p>Custom-tailored proposals and MVPs</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>Simulations</h3>
            <p>Investment and growth projections with multiple scenarios</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryDashboard;
