import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['node-fetch']
  },
  build: {
    rollupOptions: {
      external: (id) => id === 'node-fetch'
    }
  }
})
