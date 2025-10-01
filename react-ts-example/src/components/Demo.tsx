import { useState } from 'react';
import { usePolyInfer } from '../hooks/usePolyInfer';
import type { DemoResponse } from '../types';

export const Demo = () => {
  const [prompt, setPrompt] = useState('What is the capital of France?');
  const [demoResult, setDemoResult] = useState<DemoResponse | null>(null);
  const { loading, error, runDemo } = usePolyInfer();

  const handleRunDemo = async () => {
    if (!prompt.trim()) return;

    const result = await runDemo(prompt);
    if (result.success) {
      setDemoResult(result);
    }
  };

  const examplePrompts = [
    'What is the capital of France?',
    'Explain quantum computing in simple terms',
    'Write a haiku about artificial intelligence',
    'What is 2 + 2?',
    'Tell me a joke about programming',
  ];

  return (
    <div className="demo">
      <h2>🎭 Demo</h2>
      <p>Test both synchronous and concurrent modes with the same prompt.</p>

      <div className="demo-form">
        <div className="form-group">
          <label htmlFor="demo-prompt">Prompt:</label>
          <textarea
            id="demo-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={3}
          />
        </div>

        <div className="example-prompts">
          <label>Example prompts:</label>
          <div className="prompt-buttons">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(example)}
                className="example-button"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleRunDemo} disabled={loading || !prompt.trim()}>
          {loading ? '🔄 Running Demo...' : '🚀 Run Demo'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <h3>❌ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {demoResult && (
        <div className="demo-results">
          <h3>✅ Demo Results</h3>
          <p><strong>Prompt:</strong> {demoResult.prompt}</p>

          <div className="results-comparison">
            <div className="result-column">
              <h4>🔄 Synchronous Mode</h4>
              <div className="result-content">
                <p><strong>Response:</strong></p>
                <div className="response-text">{demoResult.results.synchronous.response}</div>
                <details>
                  <summary>Raw Response</summary>
                  <pre>{JSON.stringify(demoResult.results.synchronous.raw_response, null, 2)}</pre>
                </details>
              </div>
            </div>

            <div className="result-column">
              <h4>⚡ Concurrent Mode</h4>
              <div className="result-content">
                <p><strong>Response:</strong></p>
                <div className="response-text">{demoResult.results.concurrent.response}</div>
                <details>
                  <summary>Raw Response</summary>
                  <pre>{JSON.stringify(demoResult.results.concurrent.raw_response, null, 2)}</pre>
                </details>
              </div>
            </div>
          </div>

          <div className="metrics-after-demo">
            <h4>📊 Metrics After Demo</h4>
            <div className="metrics-summary">
              {Object.entries(demoResult.metrics).map(([provider, data]) => (
                <div key={provider} className="metric-summary">
                  <strong>{provider}:</strong> {data.success} success, {data.failure} failure, {data.latency}ms avg latency
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};