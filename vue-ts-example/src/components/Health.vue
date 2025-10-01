<template>
  <div class="health">
    <h2>❤️ Health Check</h2>
    <p>Check the health status of the application.</p>

    <button @click="checkHealth" :disabled="loading">
      {{ loading ? '🔄 Checking...' : '🔄 Check Health' }}
    </button>

    <div v-if="error" class="error-message">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
    </div>

    <div v-if="health" class="health-status">
      <h3>🏥 Health Status</h3>
      <div class="health-details">
        <div class="health-item">
          <strong>Status:</strong>
          <span :class="['status', health.status === 'healthy' ? 'healthy' : 'unhealthy']">
            {{ health.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy' }}
          </span>
        </div>
        <div class="health-item">
          <strong>Version:</strong> {{ health.version }}
        </div>
        <div class="health-item">
          <strong>Timestamp:</strong> {{ new Date(health.timestamp).toLocaleString() }}
        </div>
      </div>
    </div>

    <div class="system-info">
      <h3>ℹ️ System Information</h3>
      <div class="info-details">
        <div class="info-item">
          <strong>Framework:</strong> Vue + TypeScript
        </div>
        <div class="info-item">
          <strong>Package:</strong> genai-polyinfer
        </div>
        <div class="info-item">
          <strong>Features:</strong> Multi-provider orchestration, caching, metrics, logging
        </div>
        <div class="info-item">
          <strong>Providers:</strong> OpenAI, Anthropic, Google Gemini, Grok, Ollama, Mock
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePolyInfer } from '../composables/usePolyInfer.js'

export default {
  name: 'AppHealth',
  setup() {
    return usePolyInfer()
  },
  data() {
    return {
      health: null
    }
  },
  mounted() {
    this.checkHealth()
  },
  methods: {
    async checkHealth() {
      const result = await this.getHealthStatus()
      if (result.success) {
        this.health = result
      }
    }
  }
}
</script>

<style scoped>
/* Component specific styles can be added here if needed */
</style>