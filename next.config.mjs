/** @type {import('next').NextConfig} */
const nextConfig = {
    // Standalone output lets the Electron desktop build bundle a self-contained
    // Next server (server.js + minimal node_modules) instead of the full project.
    output: 'standalone',
    reactStrictMode: true,
    images: {
        domains: ['encrypted-tbn0.gstatic.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig;
