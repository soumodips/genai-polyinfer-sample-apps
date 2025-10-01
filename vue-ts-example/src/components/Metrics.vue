<template>
  <div class="metrics">
    <h2>📊 Metrics</h2>
    <p>Get current performance metrics for all providers.</p>

    <div class="metrics-actions">
      <button @click="fetchMetrics" :disabled="loading">
        {{ loading ? '🔄 Refreshing...' : '🔄 Refresh Metrics' }}
      </button>
      <button @click="handleResetMetrics" :disabled="loading" class="secondary">
        🔄 Reset Metrics
      </button>
      <button @click="handleClearCache" :disabled="loading" class="secondary">
        🗑️ Clear Cache
      </button>
    </div>

    <div v-if="error" class="error-message">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
    </div>

    <div v-if="metrics" class="metrics-data">
      <h3>📈 Provider Metrics</h3>
      <div class="metrics-grid">
        <div v-for="(data, provider) in metrics.metrics" :key="provider" class="metric-card">
          <h4>{{ provider }}</h4>
          <div class="metric-stats">
            <div class="stat">
              <span class="stat-label">Success:</span>
              <span class="stat-value success">{{ data.success }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Failure:</span>
              <span class="stat-value failure">{{ data.failure }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total:</span>
              <span class="stat-value">{{ data.count }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Avg Latency:</span>
              <span class="stat-value">{{ data.latency }}ms</span>
            </div>
            <div v-if="data.count > 0" class="stat">
              <span class="stat-label">Success Rate:</span>
              <span class="stat-value">
                {{ ((data.success / data.count) * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <p class="timestamp">Last updated: {{ new Date(metrics.timestamp).toLocaleString() }}</p>
    </div>
  </div>
</template>

<script>
import { usePolyInfer } from '../composables/usePolyInfer.js'

export default {
  name: 'AppMetrics',
  setup() {
    return usePolyInfer()
  },
  data() {
    return {
      metrics: null
    }
  },
  mounted() {
    this.fetchMetrics()
  },
  methods: {
    async fetchMetrics() {
      const result = await this.getMetricsData()
      if (result.success) {
        this.metrics = result
      }
    },
    async handleResetMetrics() {
      if (window.confirm('Are you sure you want to reset all metrics?')) {
        await this.resetMetricsData()
        await this.fetchMetrics() // Refresh metrics after reset
      }
    },
    async handleClearCache() {
      if (window.confirm('Are you sure you want to clear the cache?')) {
        await this.clearCacheData()
      }
    }
  }
}
</script>

<style scoped>
/* Component specific styles can be added here if needed */
</style>