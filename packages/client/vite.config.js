import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@whatsapp-clone/common': '@whatsapp-clone/common/index.es.js'
    }
  },
  build: {
    rollupOptions: {
      external: ['yup']
    }
  },
  server: {
    host: '0.0.0.0',
    strictPort: true,
    port: 8080,
  }
})
