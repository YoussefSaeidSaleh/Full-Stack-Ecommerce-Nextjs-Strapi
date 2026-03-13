/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meaningful-kindness-c62a76da59.strapiapp.com",
      },
      // --- الإضافة الجديدة هنا ---
      {
        protocol: "https",
        hostname: "meaningful-kindness-c62a76da59.media.strapiapp.com",
      },
      // --------------------------
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // يمكن إزالته إذا لم تعد تستخدمه
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;