import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: 'frontend',
    build: {
        outDir: resolve(__dirname, 'wwwroot/js'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'frontend/main.js'),
            output: {
                entryFileNames: `main.js`,   // force plain name
                chunkFileNames: `chunks/[name].js`,
                assetFileNames: `assets/[name].[ext]`
            }
        }
    }
});
