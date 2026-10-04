import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'randomuser.me',
            },
        ],
    },
};

export default nextConfig;
