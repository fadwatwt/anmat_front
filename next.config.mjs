/** @type {import('next').NextConfig} */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
    // Allow verification builds to use an isolated directory while a local
    // development server is running against the default .next directory.
    distDir: process.env.NEXT_DIST_DIR || '.next',
    // Standalone output lets the Electron desktop build bundle a self-contained
    // Next server (server.js + minimal node_modules) instead of the full project.
    output: 'standalone',
    outputFileTracingRoot: projectRoot,
    reactStrictMode: true,
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' }],
    },
}

export default nextConfig;
