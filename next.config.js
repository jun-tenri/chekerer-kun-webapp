/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages(next-on-pages)向け設定。
  // 各ページ/APIルートの先頭で `export const runtime = 'edge'` を宣言する必要があります。
  images: {
    unoptimized: true, // next/image の最適化はCloudflare側では未対応のためオフ
  },
};

module.exports = nextConfig;
