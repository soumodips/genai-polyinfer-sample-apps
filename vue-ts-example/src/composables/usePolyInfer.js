import { ref } from 'vue';
import { initConfig, say, getMetrics, resetMetrics, clearCache } from 'genai-polyinfer';
import config from '../../polyinfer.config.js';

// Initialize config on first import
let configInitialized = false;
if (!configInitialized) {
  initConfig(config);
  configInitialized = true;
}

export function usePolyInfer() {
  const loading = ref(false);
  const error = ref(null);

  const handleApiCall = async (apiCall) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  const makeSayRequest = async (prompt, mode) => {
    return handleApiCall(async () => {
      const configOverride = mode ? { ...config, mode } : undefined;
      const result = await say(prompt, configOverride ? { config: configOverride } : {});

      return {
        success: true,
        prompt,
        response: result.text,
        raw_response: result.raw_response,
        mode: mode || config.mode,
      };
    });
  };

  const getMetricsData = async () => {
    return handleApiCall(async () => {
      const metrics = getMetrics();
      return {
        success: true,
        metrics,
        timestamp: new Date().toISOString(),
      };
    });
  };

  const resetMetricsData = async () => {
    return handleApiCall(async () => {
      resetMetrics();
      return {
        success: true,
        message: 'Metrics reset successfully',
        timestamp: new Date().toISOString(),
      };
    });
  };

  const clearCacheData = async () => {
    return handleApiCall(async () => {
      clearCache();
      return {
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString(),
      };
    });
  };

  const getConfigData = async () => {
    return handleApiCall(async () => {
      // Remove API keys from response for security
      const safeConfig = {
        ...config,
        providers: config.providers.map((p) => ({
          ...p,
          api_key_from_env: p.api_key_from_env, // Keep env var names but not actual keys
        })),
      };

      return {
        success: true,
        config: safeConfig,
      };
    });
  };

  const getHealthStatus = async () => {
    return handleApiCall(async () => {
      return {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    });
  };

  const runDemo = async (prompt) => {
    return handleApiCall(async () => {
      // Test synchronous mode
      const syncResult = await say(prompt, { config: { ...config, mode: 'synchronous' } });

      // Test concurrent mode
      const concurrentResult = await say(prompt, { config: { ...config, mode: 'concurrent' } });

      // Get metrics after requests
      const metrics = getMetrics();

      return {
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
      };
    });
  };

  return {
    loading,
    error,
    makeSayRequest,
    getMetricsData,
    resetMetricsData,
    clearCacheData,
    getConfigData,
    getHealthStatus,
    runDemo,
  };
}