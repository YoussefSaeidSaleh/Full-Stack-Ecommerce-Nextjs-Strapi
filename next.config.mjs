/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https", // أو 'http' لو localhost
        hostname: "res.cloudinary.com", // أو 'localhost' أو '**' (لكل الدومينات)
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
