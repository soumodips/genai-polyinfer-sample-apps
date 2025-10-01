<template>
  <div class="demo">
    <h2>🎭 Demo</h2>
    <p>Test both synchronous and concurrent modes with the same prompt.</p>

    <div class="demo-form">
      <div class="form-group">
        <label for="demo-prompt">Prompt:</label>
        <textarea
          id="demo-prompt"
          v-model="prompt"
          placeholder="Enter your prompt here..."
          rows="3"
        ></textarea>
      </div>

      <div class="example-prompts">
        <label>Example prompts:</label>
        <div class="prompt-buttons">
          <button
            v-for="(example, index) in examplePrompts"
            :key="index"
            type="button"
            @click="setPrompt(example)"
            class="example-button"
          >
            {{ example }}
          </button>
        </div>
      </div>

      <button @click="handleRunDemo" :disabled="loading || !prompt.trim()">
        {{ loading ? '🔄 Running Demo...' : '🚀 Run Demo' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
    </div>

    <div v-if="demoResult" class="demo-results">
      <h3>✅ Demo Results</h3>
      <p><strong>Prompt:</strong> {{ demoResult.prompt }}</p>

      <div class="results-comparison">
        <div class="result-column">
          <h4>🔄 Synchronous Mode</h4>
          <div class="result-content">
            <p><strong>Response:</strong></p>
            <div class="response-text">{{ demoResult.results.synchronous.response }}</div>
            <details>
              <summary>Raw Response</summary>
              <pre>{{ JSON.stringify(demoResult.results.synchronous.raw_response, null, 2) }}</pre>
            </details>
          </div>
        </div>

        <div class="result-column">
          <h4>⚡ Concurrent Mode</h4>
          <div class="result-content">
            <p><strong>Response:</strong></p>
            <div class="response-text">{{ demoResult.results.concurrent.response }}</div>
            <details>
              <summary>Raw Response</summary>
              <pre>{{ JSON.stringify(demoResult.results.concurrent.raw_response, null, 2) }}</pre>
            </details>
          </div>
        </div>
      </div>

      <div class="metrics-after-demo">
        <h4>📊 Metrics After Demo</h4>
        <div class="metrics-summary">
          <div v-for="(data, provider) in demoResult.metrics" :key="provider" class="metric-summary">
            <strong>{{ provider }}:</strong> {{ data.success }} success, {{ data.failure }} failure, {{ data.latency }}ms avg latency
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePolyInfer } from '../composables/usePolyInfer.js'

export default {
  name: 'AppDemo',
  setup() {
    return usePolyInfer()
  },
  data() {
    return {
      prompt: 'What is the capital of France?',
      demoResult: null,
      examplePrompts: [
        'What is the capital of France?',
        'Explain quantum computing in simple terms',
        'Write a haiku about artificial intelligence',
        'What is 2 + 2?',
        'Tell me a joke about programming',
      ]
    }
  },
  methods: {
    async handleRunDemo() {
      if (!this.prompt.trim()) return

      const result = await this.runDemo(this.prompt)
      if (result.success) {
        this.demoResult = result
      }
    },
    setPrompt(prompt) {
      this.prompt = prompt
    }
  }
}
</script>

<style scoped>
/* Component specific styles can be added here if needed */
</style>