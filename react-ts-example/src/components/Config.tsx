import { useState, useEffect } from 'react';
import { usePolyInfer } from '../hooks/usePolyInfer';
import type { ConfigResponse } from '../types';

export const Config = () => {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const { loading, error, getConfigData } = usePolyInfer();

  useEffect(() => {
    const fetchConfig = async () => {
      const result = await getConfigData();
      if (result.success) {
        setConfig(result);
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="config">
      <h2>⚙️ Configuration</h2>
      <p>Get the current configuration (API keys are not exposed).</p>
      <div className="info-message">
        <p><strong>💡 Note:</strong> Configurations can be updated in <code>polyinfer.config.ts</code>.</p>
      </div>

      <button onClick={() => window.location.reload()} disabled={loading}>
        {loading ? '🔄 Loading...' : '🔄 Refresh Config'}
      </button>

      {error && (
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {config && (
        <div className="config-data">
          <h3>🔧 Current Configuration</h3>

          <div className="config-section">
            <h4>Global Settings</h4>
            <div className="config-item">
              <strong>Mode:</strong> {config.config.mode}
            </div>
            <div className="config-item">
              <strong>Consecutive Success:</strong> {config.config.consecutive_success}
            </div>
            <div className="config-item">
              <strong>Logging:</strong> {config.config.logging ? 'Enabled' : 'Disabled'}
            </div>
            <div className="config-item">
              <strong>Metrics:</strong> {config.config.metrics ? 'Enabled' : 'Disabled'}
            </div>
            <div className="config-item">
              <strong>Cache:</strong> {config.config.cache.enabled ? `Enabled (${config.config.cache.ttl}ms TTL)` : 'Disabled'}
            </div>
          </div>

          <div className="config-section">
            <h4>Providers ({config.config.providers.length})</h4>
            <div className="providers-grid">
              {config.config.providers.map((provider: any, index: number) => (
                <div key={index} className="provider-card">
                  <h5>{provider.name}</h5>
                  <div className="provider-details">
                    <div className="config-item">
                      <strong>API URL:</strong> <code>{provider.api_url}</code>
                    </div>
                    <div className="config-item">
                      <strong>Model:</strong> {provider.model}
                    </div>
                    <div className="config-item">
                      <strong>API Keys from Env:</strong> {provider.api_key_from_env.join(', ')}
                    </div>
                    <div className="config-item">
                      <strong>Fallback Strategy:</strong> {provider.api_key_fallback_strategy}
                    </div>
                    {provider.api_key_fallback_count && (
                      <div className="config-item">
                        <strong>Fallback Count:</strong> {provider.api_key_fallback_count}
                      </div>
                    )}
                    {provider.api_key_fallback_indices && (
                      <div className="config-item">
                        <strong>Fallback Indices:</strong> {provider.api_key_fallback_indices.join(', ')}
                      </div>
                    )}
                    {provider.api_key_fallback_range_start && provider.api_key_fallback_range_end && (
                      <div className="config-item">
                        <strong>Fallback Range:</strong> {provider.api_key_fallback_range_start} - {provider.api_key_fallback_range_end}
                      </div>
                    )}
                    <div className="config-item">
                      <strong>Response Path:</strong> <code>{provider.responsePath}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};