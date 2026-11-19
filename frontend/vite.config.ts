import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
  plugins: [react(), tailwindcss()],
})
