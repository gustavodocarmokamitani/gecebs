import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    assetsDir: '',
    rollupOptions: {
      plugins: [
        {
          name: 'minify',
          renderChunk: async (code) => {
            const result = await minify(code);
            return { code: result.code, map: null };
          },
        },
      ],
    },
    emptyOutDir: true,
    sourcemap: true,
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    proxy: {
      '/api': `http://localhost:8080`,
      '/auth': `http://localhost:8080`,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables.scss";`,
      },
    },
  },
});
