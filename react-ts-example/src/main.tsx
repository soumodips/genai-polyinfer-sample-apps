import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Polyfill process.env for browser
if (typeof window !== 'undefined') {
  (window as any).process = {
    env: {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
      OPENAI_API_KEY_BACKUP: import.meta.env.VITE_OPENAI_API_KEY_BACKUP,
      ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY,
      ANTHROPIC_API_KEY_BACKUP: import.meta.env.VITE_ANTHROPIC_API_KEY_BACKUP,
      GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
      GOOGLE_API_KEY_2: import.meta.env.VITE_GOOGLE_API_KEY_2,
      GOOGLE_API_KEY_3: import.meta.env.VITE_GOOGLE_API_KEY_3,
      GOOGLE_API_KEY_4: import.meta.env.VITE_GOOGLE_API_KEY_4,
      GOOGLE_API_KEY_5: import.meta.env.VITE_GOOGLE_API_KEY_5,
      XAI_API_KEY: import.meta.env.VITE_XAI_API_KEY,
      XAI_API_KEY_2: import.meta.env.VITE_XAI_API_KEY_2,
      XAI_API_KEY_3: import.meta.env.VITE_XAI_API_KEY_3,
      XAI_API_KEY_4: import.meta.env.VITE_XAI_API_KEY_4,
      XAI_API_KEY_5: import.meta.env.VITE_XAI_API_KEY_5,
      XAI_API_KEY_6: import.meta.env.VITE_XAI_API_KEY_6,
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
