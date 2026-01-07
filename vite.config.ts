import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      includeAssets: [
        'icon-192.png',
        'icon-512.png'
      ],
      manifest: false
    })
  ],
  build: {
    outDir: 'dist'
  }
})
