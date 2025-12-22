import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dvdms/',
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/api/v1/': {
        target: 'http://10.226.28.177:8025',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
