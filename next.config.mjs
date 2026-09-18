/** @type {import('next').NextConfig} */
// 部署在根路径（EdgeOne Pages 等）时不设 BASE_PATH；
// 部署在子路径（GitHub Pages 项目页 https://<用户>.github.io/<仓库>/）时用 BASE_PATH=/<仓库> 构建。
const basePath = process.env.BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
