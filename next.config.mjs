/** @type {import('next').NextConfig} */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    // Standalone output lets the Electron desktop build bundle a self-contained
    // Next server (server.js + minimal node_modules) instead of the full project.
    output: 'standalone',
    outputFileTracingRoot: projectRoot,
    reactStrictMode: true,
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' }],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig;
