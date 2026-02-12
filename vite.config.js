import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-factus': {
        target: 'https://api-sandbox.factus.com.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-factus/, ''),
        secure: false,
      },
    },
  },
})
