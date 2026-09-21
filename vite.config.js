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
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 98.css ships `@media (not(hover))`, which lightningcss (Vite's default minifier) rejects.
    // 98.css is already minified and our own CSS is tiny, so skip CSS minification.
    cssMinify: false,
  },
})
