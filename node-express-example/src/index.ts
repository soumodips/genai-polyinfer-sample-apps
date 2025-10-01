import express from 'express';
import { initConfig, say, getMetrics, resetMetrics, clearCache, type Config } from 'genai-polyinfer';
import config from '../polyinfer.config.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize genai-polyinfer with global config
initConfig(config as Config);

app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Main endpoint to make AI requests
app.post('/say', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use global config or override mode if specified
    const configOverride = mode ? { ...config, mode } : undefined;

    const result = await say(prompt, configOverride ? { config: configOverride } : {});

    res.json({
      success: true,
      prompt,
      response: result.text,
      raw_response: result.raw_response,
      mode: mode || config.mode,
    });
  } catch (error) {
    console.error('Error in /say:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get current metrics
app.get('/metrics', (req, res) => {
  const metrics = getMetrics();
  res.json({
    success: true,
    metrics,
    timestamp: new Date().toISOString(),
  });
});

// Reset metrics
app.post('/reset-metrics', (req, res) => {
  resetMetrics();
  res.json({
    success: true,
    message: 'Metrics reset successfully',
    timestamp: new Date().toISOString(),
  });
});

// Clear cache
app.post('/clear-cache', (req, res) => {
  clearCache();
  res.json({
    success: true,
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString(),
  });
});

// Get current configuration (without sensitive data)
app.get('/config', (req, res) => {
  // Remove API keys from response for security
  const safeConfig = {
    ...config,
    providers: config.providers.map((p: any) => ({
      ...p,
      api_key_from_env: p.api_key_from_env, // Keep env var names but not actual keys
    })),
  };

  res.json({
    success: true,
    config: safeConfig,
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Demo endpoint showing different modes
app.post('/demo', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Test synchronous mode
    const syncResult = await say(prompt, { config: { ...config, mode: 'synchronous' } });

    // Test concurrent mode
    const concurrentResult = await say(prompt, { config: { ...config, mode: 'concurrent' } });

    // Get metrics after requests
    const metrics = getMetrics();

    res.json({
      success: true,
      prompt,
      results: {
        synchronous: {
          response: syncResult.text,
          raw_response: syncResult.raw_response,
        },
        concurrent: {
          response: concurrentResult.text,
          raw_response: concurrentResult.raw_response,
        },
      },
      metrics,
    });
  } catch (error) {
    console.error('Error in /demo:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /say - Make AI request',
      'GET /metrics - Get metrics',
      'POST /reset-metrics - Reset metrics',
      'POST /clear-cache - Clear cache',
      'GET /config - Get configuration',
      'GET /health - Health check',
      'POST /demo - Demo different modes',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Example server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   POST /say - Make AI requests`);
  console.log(`   GET /metrics - View performance metrics`);
  console.log(`   POST /reset-metrics - Reset metrics`);
  console.log(`   POST /clear-cache - Clear response cache`);
  console.log(`   GET /config - View current configuration`);
  console.log(`   POST /demo - Test different orchestration modes`);
  console.log(`   GET /health - Health check`);
});