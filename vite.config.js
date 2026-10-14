import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'www',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2020'
  },
  server: {
    host: '0.0.0.0'
  }
});
