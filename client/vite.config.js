/// <reference types="vitest" />
import path from 'path'
import { fileURLToPath } from 'url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@devStack': path.resolve(__dirname, 'devStack'),
    },
  },

  server: {
    port: 3005,
    open: true,
  },

  build: {
    sourcemap: true,
    outDir: 'dist',
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
