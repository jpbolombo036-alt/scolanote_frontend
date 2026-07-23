import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: './',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://scolanote-production.up.railway.app',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://scolanote-production.up.railway.app',
        changeOrigin: true
      },
      '/auth': {
        target: 'https://scolanote-production.up.railway.app',
        changeOrigin: true
      }
    }
  }
})
