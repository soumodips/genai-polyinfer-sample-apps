import { useState, useCallback } from 'react';
import { initConfig, say, getMetrics, resetMetrics, clearCache, type Config } from 'genai-polyinfer';
import config from '../../polyinfer.config.js';
import type {
  SayResponse,
  MetricsResponse,
  ConfigResponse,
  HealthResponse,
  DemoResponse,
  ApiResponse
} from '../types';

// Initialize config on first import
let configInitialized = false;
if (!configInitialized) {
  initConfig(config as Config);
  configInitialized = true;
}

export const usePolyInfer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const makeSayRequest = useCallback(async (
    prompt: string,
    mode?: 'synchronous' | 'concurrent'
  ): Promise<ApiResponse<SayResponse>> => {
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
  }, [handleApiCall]);

  const getMetricsData = useCallback(async (): Promise<ApiResponse<MetricsResponse>> => {
    return handleApiCall(async () => {
      const metrics = getMetrics();
      return {
        success: true,
        metrics,
        timestamp: new Date().toISOString(),
      };
    });
  }, [handleApiCall]);

  const resetMetricsData = useCallback(async (): Promise<ApiResponse<{ success: true; message: string; timestamp: string }>> => {
    return handleApiCall(async () => {
      resetMetrics();
      return {
        success: true,
        message: 'Metrics reset successfully',
        timestamp: new Date().toISOString(),
      };
    });
  }, [handleApiCall]);

  const clearCacheData = useCallback(async (): Promise<ApiResponse<{ success: true; message: string; timestamp: string }>> => {
    return handleApiCall(async () => {
      clearCache();
      return {
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString(),
      };
    });
  }, [handleApiCall]);

  const getConfigData = useCallback(async (): Promise<ApiResponse<ConfigResponse>> => {
    return handleApiCall(async () => {
      // Remove API keys from response for security
      const safeConfig = {
        ...config,
        providers: config.providers.map((p: any) => ({
          ...p,
          api_key_from_env: p.api_key_from_env, // Keep env var names but not actual keys
        })),
      };

      return {
        success: true,
        config: safeConfig,
      };
    });
  }, [handleApiCall]);

  const getHealthStatus = useCallback(async (): Promise<ApiResponse<HealthResponse>> => {
    return handleApiCall(async () => {
      return {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    });
  }, [handleApiCall]);

  const runDemo = useCallback(async (prompt: string): Promise<ApiResponse<DemoResponse>> => {
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
  }, [handleApiCall]);

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
};