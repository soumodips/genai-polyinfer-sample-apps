import { Injectable } from '@angular/core';
import { initConfig, say, getMetrics, resetMetrics, clearCache, type Config } from 'genai-polyinfer';
import config from '../../../polyinfer.config.js';
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

@Injectable({
  providedIn: 'root'
})
export class PolyInferService {
  private loading = false;
  private error: string | null = null;

  get isLoading(): boolean {
    return this.loading;
  }

  get currentError(): string | null {
    return this.error;
  }

  private async handleApiCall<T>(
    apiCall: () => Promise<T>
  ): Promise<ApiResponse<T>> {
    this.loading = true;
    this.error = null;
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.error = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      this.loading = false;
    }
  }

  async makeSayRequest(
    prompt: string,
    mode?: 'synchronous' | 'concurrent'
  ): Promise<ApiResponse<SayResponse>> {
    return this.handleApiCall(async () => {
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
  }

  async getMetricsData(): Promise<ApiResponse<MetricsResponse>> {
    return this.handleApiCall(async () => {
      const metrics = getMetrics();
      return {
        success: true,
        metrics,
        timestamp: new Date().toISOString(),
      };
    });
  }

  async resetMetricsData(): Promise<ApiResponse<{ success: true; message: string; timestamp: string }>> {
    return this.handleApiCall(async () => {
      resetMetrics();
      return {
        success: true,
        message: 'Metrics reset successfully',
        timestamp: new Date().toISOString(),
      };
    });
  }

  async clearCacheData(): Promise<ApiResponse<{ success: true; message: string; timestamp: string }>> {
    return this.handleApiCall(async () => {
      clearCache();
      return {
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString(),
      };
    });
  }

  async getConfigData(): Promise<ApiResponse<ConfigResponse>> {
    return this.handleApiCall(async () => {
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
  }

  async getHealthStatus(): Promise<ApiResponse<HealthResponse>> {
    return this.handleApiCall(async () => {
      return {
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      };
    });
  }

  async runDemo(prompt: string): Promise<ApiResponse<DemoResponse>> {
    return this.handleApiCall(async () => {
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
  }
}