// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/register',
        '/login',
        '/profile',
        '/blog/posts/*/edit',
        '/blog/posts/create',
        '/blog/posts/*/delete',
        '/blog/dashboard',
        '/products/create',
        '/products/dashboard',
        '/products/*/delete',
        '/products/*/edit',
        '/download-catalog',
        '/download-catalog/*',
      ],
    },
    sitemap: 'https://www.adsh2014.al/sitemap.xml',
  };
}