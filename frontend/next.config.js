/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    // Disable Webpack disk pack file cache in development on Windows
    // to prevent PackFileCacheStrategy ENOENT .pack.gz file lock errors
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "pbxt.replicate.delivery" },
      { protocol: "https", hostname: "image.pollinations.ai" },
      { protocol: "https", hostname: "pollinations.ai" },
      { protocol: "https", hostname: "*.blob.core.windows.net" },
    ],
  },
};

module.exports = nextConfig;
