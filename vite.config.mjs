// vite.config.mjs

import react from '@vitejs/plugin-react';
import path from 'path';
import hash from 'rollup-plugin-hash';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
      },
    }),
    {
      ...hash({
        dest: 'dist', // Output directory
        manifest: true, // Generate a manifest file
        replace: true, // Replace original files with hashed versions
      }),
      apply: 'build', // Apply only during build
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
      '@hooks': path.resolve('./src/hooks/index.ts'),
      '@api': path.resolve('./src/api'),
      '@components': path.resolve('./src/components'),
      '@pages': path.resolve('./src/pages'),
      '@styles': path.resolve('./src/styles'),
      '@utils': path.resolve('./src/utils'),
      '@context': path.resolve('./src/context'),
      '@assets': path.resolve('./src/assets'),
      '@constants': path.resolve('./src/constants'),
      '@types': path.resolve('./src/types'),
      '@services': path.resolve('./src/services'),
      '@config': path.resolve('./src/config'),
      '@store': path.resolve('./src/store'),
      '@models': path.resolve('./src/models'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    files: ['src/**/*.test.tsx'],
    exclude: ['./tests/playwright', './node_modules/**', './functions/**'],
  },
  // server: {
  //   host: true,
  //   port: 3000,
  // },
});
