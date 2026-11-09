import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// npx vite build -c tools/preview/vite.config.ts → .output/preview/preview.js (window.OTPreview)
export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../../.output/preview'),
    emptyOutDir: true,
    minify: true,
    lib: { entry: resolve(__dirname, 'entry.ts'), name: 'OTPreview', formats: ['iife'], fileName: () => 'preview.js' },
  },
});
