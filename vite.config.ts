import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ensure 'buffer' package is used instead of vagaries of Node built-ins
      buffer: resolve(__dirname, 'node_modules', 'buffer', 'index.js')
    }
  },
  optimizeDeps: {
    include: ['buffer']
  }
})
