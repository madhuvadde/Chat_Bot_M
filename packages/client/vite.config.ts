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
            target: process.env.VITE_API_URL || 'http://localhost:3000',
            changeOrigin: true,
         },
      },
   },
   define: {
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
   },
});
