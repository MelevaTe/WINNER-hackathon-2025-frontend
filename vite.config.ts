import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        svgr(),
        react(),
        tsconfigPaths()
    ],
    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
        ]
    },
    define: {
        __IS_DEV__: JSON.stringify(true),
        __API__: JSON.stringify('http://172.20.10.2:5001'),
        __CLIENT_ID_GOOGLE__: JSON.stringify('407772935914-jvr3iej6ik922cv0rip2mdl36b5bc0jo.apps.googleusercontent.com'),
    },
    server: {
        port: 3000,
        host: 'localhost',
        allowedHosts: ['850668831cae.ngrok-free.app'],
    }
})