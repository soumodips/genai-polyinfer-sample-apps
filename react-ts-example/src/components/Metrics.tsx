import { useState, useEffect } from 'react';
import { usePolyInfer } from '../hooks/usePolyInfer';
import type { MetricsResponse } from '../types';

export const Metrics = () => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const { loading, error, getMetricsData, resetMetricsData, clearCacheData } = usePolyInfer();

  const fetchMetrics = async () => {
    const result = await getMetricsData();
    if (result.success) {
      setMetrics(result);
    }
  };

  const handleResetMetrics = async () => {
    if (window.confirm('Are you sure you want to reset all metrics?')) {
      await resetMetricsData();
      await fetchMetrics(); // Refresh metrics after reset
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear the cache?')) {
      await clearCacheData();
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="metrics">
      <h2>📊 Metrics</h2>
      <p>Get current performance metrics for all providers.</p>

      <div className="metrics-actions">
        <button onClick={fetchMetrics} disabled={loading}>
          {loading ? '🔄 Refreshing...' : '🔄 Refresh Metrics'}
        </button>
        <button onClick={handleResetMetrics} disabled={loading} className="secondary">
          🔄 Reset Metrics
        </button>
        <button onClick={handleClearCache} disabled={loading} className="secondary">
          🗑️ Clear Cache
        </button>
      </div>

      {error && (
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {metrics && (
        <div className="metrics-data">
          <h3>📈 Provider Metrics</h3>
          <div className="metrics-grid">
            {Object.entries(metrics.metrics).map(([provider, data]) => (
              <div key={provider} className="metric-card">
                <h4>{provider}</h4>
                <div className="metric-stats">
                  <div className="stat">
                    <span className="stat-label">Success:</span>
                    <span className="stat-value success">{data.success}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Failure:</span>
                    <span className="stat-value failure">{data.failure}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">{data.count}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Avg Latency:</span>
                    <span className="stat-value">{data.latency}ms</span>
                  </div>
                  {data.count > 0 && (
                    <div className="stat">
                      <span className="stat-label">Success Rate:</span>
                      <span className="stat-value">
                        {((data.success / data.count) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="timestamp">Last updated: {new Date(metrics.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};