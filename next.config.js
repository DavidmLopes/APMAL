/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.anime-planet.com',
                port: '',
                pathname: '/anime/primary/**',
            },
        ],
    },
}

module.exports = nextConfig
