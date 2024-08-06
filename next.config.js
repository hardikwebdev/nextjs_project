// next.config.js

module.exports = (phase, { defaultConfig }) => {
  const isProd = process.env.NODE_ENV === 'production';

  const nextConfig = {
    env: {
      API_KEY: process.env.API_KEY,
    },
    output: 'standalone',
    reactStrictMode: isProd ? true : false,
    trailingSlash: true,
    swcMinify: true,
    images: {
      loader: 'imgix',
      path: '/',
    },

    async rewrites() {
      return [
        {
          source: '/',
          destination: '/frontend/home',
        },
        {
          source: '/blog',
          destination: '/frontend/blog',
        },
        {
          source: '/blog/blog-detail',
          destination: '/frontend/blog/blog-detail',
        },
        {
          source: '/news',
          destination: '/frontend/news',
        },
        {
          source: '/news/news-detail',
          destination: '/frontend/news/news-detail',
        },
        {
          source: '/about',
          destination: '/frontend/about',
        },
        {
          source: '/tip',
          destination: '/frontend/tip',
        },
        {
          source: '/account/login',
          destination: '/frontend/account/login',
        },
        {
          source: '/account/sign-up',
          destination: '/frontend/account/sign-up',
        },
        {
          source: '/account/change-password',
          destination: '/frontend/account/change-password',
        },
        {
          source: '/account/set-password',
          destination: '/frontend/account/set-password',
        },
        {
          source: '/account/forgot-password',
          destination: '/frontend/account/forgot-password',
        },
        {
          source: '/profile',
          destination: '/frontend/profile',
        },
        {
          source: '/search',
          destination: '/frontend/search',
        },
        {
          source: '/profile/personal-profile',
          destination: '/frontend/profile/personal-profile',
        },
        {
          source: '/profile/edit-account',
          destination: '/frontend/profile/edit-account',
        },
        {
          source: '/profile/video-articles',
          destination: '/frontend/profile/video-articles',
        },
        {
          source: '/profile/subscription-plan',
          destination: '/frontend/profile/subscription-plan',
        },
        
        {
          source: '/:slug*',
          destination: '/frontend/detail/:slug*',
        },
        {
          source: '/:path*',
          destination: '/404',
        },
      ]
    },
  };

  return nextConfig;
};
