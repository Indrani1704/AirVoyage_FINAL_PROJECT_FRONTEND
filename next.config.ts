/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",              // your backend (if still used)
      "res.cloudinary.com",     // Cloudinary
      "images.unsplash.com",    // ✅ Unsplash (FIX)
    ],
  },
};

module.exports = nextConfig;