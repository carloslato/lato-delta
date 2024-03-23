//import build from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    //build(),
    // devServer({
    //   entry: 'src/index.tsx'
    // })
  ],
  server: {
    port: 3000,
    hmr: {
      clientPort: 3000,
    }
  }
})
