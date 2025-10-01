import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// WARNING: This polyfill exposes API keys to the browser, which is insecure for production.
// For production applications, implement a backend API proxy to handle AI requests securely.
// This example is for demonstration purposes only.
if (typeof window !== 'undefined') {
  (window as any).process = {
    env: {
      OPENAI_API_KEY: (window as any).VITE_OPENAI_API_KEY,
      OPENAI_API_KEY_BACKUP: (window as any).VITE_OPENAI_API_KEY_BACKUP,
      ANTHROPIC_API_KEY: (window as any).VITE_ANTHROPIC_API_KEY,
      ANTHROPIC_API_KEY_BACKUP: (window as any).VITE_ANTHROPIC_API_KEY_BACKUP,
      GOOGLE_API_KEY: (window as any).VITE_GOOGLE_API_KEY,
      GOOGLE_API_KEY_2: (window as any).VITE_GOOGLE_API_KEY_2,
      GOOGLE_API_KEY_3: (window as any).VITE_GOOGLE_API_KEY_3,
      GOOGLE_API_KEY_4: (window as any).VITE_GOOGLE_API_KEY_4,
      GOOGLE_API_KEY_5: (window as any).VITE_GOOGLE_API_KEY_5,
      XAI_API_KEY: (window as any).VITE_XAI_API_KEY,
      XAI_API_KEY_2: (window as any).VITE_XAI_API_KEY_2,
      XAI_API_KEY_3: (window as any).VITE_XAI_API_KEY_3,
      XAI_API_KEY_4: (window as any).VITE_XAI_API_KEY_4,
      XAI_API_KEY_5: (window as any).VITE_XAI_API_KEY_5,
      XAI_API_KEY_6: (window as any).VITE_XAI_API_KEY_6,
    }
  };
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
