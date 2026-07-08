import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the build works on any host
// (Hostinger subfolder, GitHub Pages, Vercel, etc.)
export default defineConfig({
  plugins: [react()],
  base: './',
})
