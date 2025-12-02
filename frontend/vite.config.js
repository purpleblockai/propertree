import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  // Ensure _redirects file is copied to dist
  publicDir: 'public',
  build: {
    // Copy _redirects to dist root
    rollupOptions: {
      output: {
        // Ensure _redirects is included in build
      }
    }
  }
})
