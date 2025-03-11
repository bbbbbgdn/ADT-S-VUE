import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // https: {
    //   // You can use self-signed certificates for local development
    //   // If you don't have certificates, Vite will generate them for you
    //   // But for better compatibility, you can create your own
    //   key: fs.existsSync('localhost-key.pem') ? fs.readFileSync('localhost-key.pem') : undefined,
    //   cert: fs.existsSync('localhost.pem') ? fs.readFileSync('localhost.pem') : undefined,
    // },
    host: true, // Needed for accessing from other devices on the network
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
    },
  },
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
