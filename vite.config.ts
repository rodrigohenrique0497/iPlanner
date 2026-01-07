
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      // Configurações específicas para injeção de manifest
      injectManifest: {
        swSrc: 'sw.js',
        swDest: 'dist/sw.js',
        injectionPoint: 'self.__WB_MANIFEST'
      },
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false, // Usando o manifest.json manual da pasta public
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
