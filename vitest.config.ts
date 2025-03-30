import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './client/src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client'),
      '@shared': resolve(__dirname, './shared'),
    },
  },
}) 