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
            {
                protocol: 'https',
                hostname: 'cdn.myanimelist.net',
                port: '',
                pathname: '/images/anime/**',
            },
        ],
    },
}

module.exports = nextConfig
