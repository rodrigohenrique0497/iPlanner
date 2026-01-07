
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest', // Alterado para injectManifest para usar o seu sw.js customizado
      srcDir: '.',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false, // Mantido false para usar o seu public/manifest.json manual
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@supabase/supabase-js']
        }
      }
    }
  }
})
