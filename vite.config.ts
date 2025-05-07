import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {  // 前端用 /api 前缀代理到后端
        target: 'http://localhost:8000',  // 后端地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // 移除前缀
      },
    },
  },
})
