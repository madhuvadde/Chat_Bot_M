import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
   plugins: [react(), tailwindcss()],
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src'),
      },
   },
   server: {
      proxy: {
         '/api': {
            // target: 'http://localhost:3000',
            target: 'http://resourceful-peace.railway.internal:11434',
            changeOrigin: true,
         },
      },
   },
   build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild', // Use esbuild instead of terser for better compatibility
      rollupOptions: {
         output: {
            manualChunks: {
               vendor: ['react', 'react-dom'],
               ui: ['@radix-ui/react-slot', 'lucide-react'],
            },
         },
      },
   },
   base: '/', // Ensure assets are served from root path
});
