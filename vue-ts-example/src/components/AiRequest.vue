<template>
  <div class="ai-request">
    <h2>🤖 AI Request</h2>
    <p>Make an AI inference request using the configured providers.</p>

    <form @submit.prevent="onSubmit" class="request-form">
      <div class="form-group">
        <label for="prompt">Prompt:</label>
        <textarea
          id="prompt"
          v-model="prompt"
          placeholder="Enter your prompt here..."
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="mode">Mode:</label>
        <select id="mode" v-model="mode">
          <option value="synchronous">Synchronous (try providers sequentially)</option>
          <option value="concurrent">Concurrent (try all providers simultaneously)</option>
        </select>
      </div>

      <button type="submit" :disabled="loading || !prompt.trim()">
        {{ loading ? '🔄 Processing...' : '🚀 Send Request' }}
      </button>
    </form>

    <div v-if="error" class="error-message">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
    </div>

    <div v-if="response" class="response-section">
      <h3>✅ Response</h3>
      <div class="response-details">
        <p><strong>Prompt:</strong> {{ response.prompt }}</p>
        <p><strong>Mode:</strong> {{ response.mode }}</p>
        <p><strong>Response:</strong></p>
        <div class="response-text">{{ response.response }}</div>
        <details>
          <summary>Raw Response</summary>
          <pre>{{ JSON.stringify(response.raw_response, null, 2) }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script>
import { usePolyInfer } from '../composables/usePolyInfer.js'

export default {
  name: 'AiRequest',
  setup() {
    return usePolyInfer()
  },
  data() {
    return {
      prompt: '',
      mode: 'synchronous',
      response: null
    }
  },
  methods: {
    async onSubmit() {
      if (!this.prompt.trim()) return

      const result = await this.makeSayRequest(this.prompt, this.mode)
      if (result.success) {
        this.response = result
      }
    }
  }
}
</script>

<style scoped>
/* Component specific styles can be added here if needed */
</style>