import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加对 GLSL 文件的支持
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: [
        {
          loader: 'glslify-loader',
          options: {
            transform: [
              ['glslify-hex', { 'option-1': true, 'option-2': 42 }]
            ]
          }
        },
        {
          loader: 'raw-loader'
        }
      ]
    });

    return config;
  },
  // 添加文件扩展名支持
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  

};

export default nextConfig;
