import { useState } from 'react';
import { usePolyInfer } from '../hooks/usePolyInfer';
import type { SayResponse } from '../types';

export const AIRequest = () => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'synchronous' | 'concurrent'>('synchronous');
  const [response, setResponse] = useState<SayResponse | null>(null);
  const { loading, error, makeSayRequest } = usePolyInfer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const result = await makeSayRequest(prompt, mode);
    if (result.success) {
      setResponse(result);
    }
  };

  return (
    <div className="ai-request">
      <h2>🤖 AI Request</h2>
      <p>Make an AI inference request using the configured providers.</p>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label htmlFor="prompt">Prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mode">Mode:</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'synchronous' | 'concurrent')}
          >
            <option value="synchronous">Synchronous (try providers sequentially)</option>
            <option value="concurrent">Concurrent (try all providers simultaneously)</option>
          </select>
        </div>

        <button type="submit" disabled={loading || !prompt.trim()}>
          {loading ? '🔄 Processing...' : '🚀 Send Request'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="response-section">
          <h3>✅ Response</h3>
          <div className="response-details">
            <p><strong>Prompt:</strong> {response.prompt}</p>
            <p><strong>Mode:</strong> {response.mode}</p>
            <p><strong>Response:</strong></p>
            <div className="response-text">{response.response}</div>
            <details>
              <summary>Raw Response</summary>
              <pre>{JSON.stringify(response.raw_response, null, 2)}</pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};