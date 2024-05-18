/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**',
            // hostname: 'https://cloudinary.com/',
            // port: '',
            // pathname: '/my-bucket/**',
          },
        ],
      },
};

export default nextConfig;
