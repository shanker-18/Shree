import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['mongodb', 'crypto', 'util'],
    },
  },
  resolve: {
    alias: {
      // Provide browser alternatives for Node.js modules
      util: 'util',
      crypto: 'crypto-browserify',
    },
  },
  preview: {
    allowedHosts: ['shree-raga-swaad-ghar.onrender.com', 'hub-yno6.onrender.com']
  },
});
