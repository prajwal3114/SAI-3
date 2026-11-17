import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const backend = env.VITE_BACKEND_URL || 'http://localhost:5000'
  return {
  plugins: [react()],
  server: {
    proxy: {
      '/api': backend,
      '/uploads': backend,
    },
  },
  }
})
