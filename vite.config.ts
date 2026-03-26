import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [
        'A:/Projects/Velo',
        'C:/Users/abhij/.gemini/antigravity/brain/d8a1cbd0-94a4-4043-a23a-d29cb86896bf'
      ]
    }
  }
})
