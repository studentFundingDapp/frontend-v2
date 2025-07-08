import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/frontend-v2/',
  server: {
    host: "localhost",
    port: 5173,
    hmr: {
      overlay: false,}
    }
})
