import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias:
            ['assets', 'components', 'pages', 'redux', 'services', 'shared', 'styles', 'utils'].map(
                (name) => ({
                    find: name === 'redux' ? /^redux\// : name,
                    replacement: fileURLToPath(new URL('./src/' + name + (name === 'redux' ? '/' : ''), import.meta.url)),
                })
            ),
    },
    server: {
        proxy: {
            '/api': 'http://127.0.0.1:5000',
            '/uploads': 'http://127.0.0.1:5000',
        },
    },
});
