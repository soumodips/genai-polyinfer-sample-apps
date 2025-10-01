import { createApp } from 'vue'
import App from './App.vue'

// WARNING: This polyfill exposes API keys to the browser, which is insecure for production.
// For production applications, implement a backend API proxy to handle AI requests securely.
// This example is for demonstration purposes only.
if (typeof window !== 'undefined') {
  window.process = {
    env: {
      OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY,
      OPENAI_API_KEY_BACKUP: process.env.VITE_OPENAI_API_KEY_BACKUP,
      ANTHROPIC_API_KEY: process.env.VITE_ANTHROPIC_API_KEY,
      ANTHROPIC_API_KEY_BACKUP: process.env.VITE_ANTHROPIC_API_KEY_BACKUP,
      GOOGLE_API_KEY: process.env.VITE_GOOGLE_API_KEY,
      GOOGLE_API_KEY_2: process.env.VITE_GOOGLE_API_KEY_2,
      GOOGLE_API_KEY_3: process.env.VITE_GOOGLE_API_KEY_3,
      GOOGLE_API_KEY_4: process.env.VITE_GOOGLE_API_KEY_4,
      GOOGLE_API_KEY_5: process.env.VITE_GOOGLE_API_KEY_5,
      XAI_API_KEY: process.env.VITE_XAI_API_KEY,
      XAI_API_KEY_2: process.env.VITE_XAI_API_KEY_2,
      XAI_API_KEY_3: process.env.VITE_XAI_API_KEY_3,
      XAI_API_KEY_4: process.env.VITE_XAI_API_KEY_4,
      XAI_API_KEY_5: process.env.VITE_XAI_API_KEY_5,
      XAI_API_KEY_6: process.env.VITE_XAI_API_KEY_6,
    }
  };
}

createApp(App).mount('#app')
