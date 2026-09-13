const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      }
    ],
  },
  experimental:{
    serverActions: {
      bodySizeLimits:"5mb",
    }
  }
}


module.exports = nextConfig;
