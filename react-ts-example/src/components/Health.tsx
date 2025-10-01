import { useState, useEffect } from 'react';
import { usePolyInfer } from '../hooks/usePolyInfer';
import type { HealthResponse } from '../types';

export const Health = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const { loading, error, getHealthStatus } = usePolyInfer();

  const checkHealth = async () => {
    const result = await getHealthStatus();
    if (result.success) {
      setHealth(result);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="health">
      <h2>❤️ Health Check</h2>
      <p>Check the health status of the application.</p>

      <button onClick={checkHealth} disabled={loading}>
        {loading ? '🔄 Checking...' : '🔄 Check Health'}
      </button>

      {error && (
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {health && (
        <div className="health-status">
          <h3>🏥 Health Status</h3>
          <div className="health-details">
            <div className="health-item">
              <strong>Status:</strong>
              <span className={`status ${health.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                {health.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}
              </span>
            </div>
            <div className="health-item">
              <strong>Version:</strong> {health.version}
            </div>
            <div className="health-item">
              <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="system-info">
        <h3>ℹ️ System Information</h3>
        <div className="info-details">
          <div className="info-item">
            <strong>Framework:</strong> React + TypeScript + Vite
          </div>
          <div className="info-item">
            <strong>Package:</strong> genai-polyinfer
          </div>
          <div className="info-item">
            <strong>Features:</strong> Multi-provider orchestration, caching, metrics, logging
          </div>
          <div className="info-item">
            <strong>Providers:</strong> OpenAI, Anthropic, Google Gemini, Grok, Ollama, Mock
          </div>
        </div>
      </div>
    </div>
  );
};