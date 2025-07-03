/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['encrypted-tbn0.gstatic.com'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig;
