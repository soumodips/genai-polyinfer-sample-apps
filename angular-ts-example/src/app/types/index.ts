import type { Config } from 'genai-polyinfer';

export interface SayResponse {
  success: boolean;
  prompt: string;
  response: string;
  raw_response: any;
  mode: string;
}

export interface MetricsResponse {
  success: boolean;
  metrics: Record<string, {
    success: number;
    failure: number;
    latency: number;
    count: number;
  }>;
  timestamp: string;
}

export interface ConfigResponse {
  success: boolean;
  config: Config;
}

export interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
  version: string;
}

export interface DemoResponse {
  success: boolean;
  prompt: string;
  results: {
    synchronous: {
      response: string;
      raw_response: any;
    };
    concurrent: {
      response: string;
      raw_response: any;
    };
  };
  metrics: Record<string, any>;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = T | ApiError;