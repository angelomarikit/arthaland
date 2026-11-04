import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
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
