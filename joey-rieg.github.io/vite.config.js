import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    root: '.', // project root
    base: '/js/', // base path from where main js is served publicly
    build: {
        outDir: resolve(__dirname, 'wwwroot/js'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'js/main.js'),
            output: {
                entryFileNames: 'main.js',
                chunkFileNames: 'chunks/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            },
        },
    },
});
