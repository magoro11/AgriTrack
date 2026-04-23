import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const djangoTarget = (mode) => {
  const url = loadEnv(mode, process.cwd(), '').VITE_DEV_PROXY_TARGET?.trim()
  if (url) return url.replace(/\/+$/, '')
  return 'http://127.0.0.1:8000'
}

const apiProxy = (mode) => ({
  '/api': {
    target: djangoTarget(mode),
    changeOrigin: true,
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    target: 'es2020',
  },
  server: {
    proxy: apiProxy(mode),
  },
  preview: {
    proxy: apiProxy(mode),
  },
}))
