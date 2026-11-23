import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('gsap') || id.includes('motion/') || id.includes('@gsap')) {
            return 'vendor-motion'
          }
          if (id.includes('lucide-react')) return 'vendor-icons'
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-fallback-preview',
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url?.split('?')[0] ?? ''
          if (
            req.method === 'GET' &&
            !url.startsWith('/assets') &&
            !url.includes('.') &&
            url !== '/'
          ) {
            req.url = '/'
          }
          next()
        })
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 5174,
    allowedHosts: ['replication-grade-harvard-bunny.trycloudflare.com'],
  },
})
