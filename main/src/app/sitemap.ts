// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.adsh2014.al';

  // --- Static Routes ---
  const staticRoutes = [
    '', // Home page
    'about',
    'blog',
    'blog/posts',
    'blog/authors',
    'contact',
    'privacy-policy',
    'products',
    'products/full-catalog',
  ];
  const staticEntries = staticRoutes.map((route) => ({
    url: route === '' ? `${baseUrl}/` : `${baseUrl}/${route}`,
    lastModified: new Date(),
  }));

  // --- Hardcoded Dynamic Routes: Blog Categories ---
  const blogCategorySlugs = ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Equipment', 'Other'];
  const blogCategoryEntries = blogCategorySlugs.map((slug) => ({
    url: `${baseUrl}/blog/posts/categories/${encodeURIComponent(slug)}`,
    lastModified: new Date(),
  }));

  // --- Hardcoded Dynamic Routes: Product Categories ---
  const productCategorySlugs = ['dairy', 'ice-cream', 'pastry', 'bakery', 'packaging', 'equipment'];
  const productCategoryEntries = productCategorySlugs.map((slug) => ({
    url: `${baseUrl}/products/category/${slug}`,
    lastModified: new Date(),
  }));

  // --- Dynamic Routes: Blog Posts and Posts by Author ---
  let postEntries: MetadataRoute.Sitemap = [];
  let authorPostEntries: MetadataRoute.Sitemap = [];
  try {
    const resPosts = await fetch(`${baseUrl}/api/posts`, { cache: 'no-cache' });
    if (resPosts.ok) {
      const posts = await resPosts.json();
      // Blog post entries
      postEntries = posts.map((post: any) => ({
        url: `${baseUrl}/blog/posts/${post._id}`,
        lastModified: new Date(post.updatedAt || post.createdAt || Date.now()),
      }));
      // Unique author IDs for posts by author
      const authorIds = [...new Set(posts.map((post: any) => post.creator._id))];
      authorPostEntries = authorIds.map((id) => ({
        url: `${baseUrl}/blog/posts/users/${id}`,
        lastModified: new Date(),
      }));
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // --- Dynamic Routes: Products ---
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const resProducts = await fetch(`${baseUrl}/api/products`, { cache: 'no-cache' });
    if (resProducts.ok) {
      const products = await resProducts.json();
      productEntries = products.map((product: any) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
      }));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // --- Combine All Entries ---
  const sitemapEntries: MetadataRoute.Sitemap = [
    ...staticEntries,
    ...blogCategoryEntries,
    ...productCategoryEntries,
    ...postEntries,
    ...productEntries,
    ...authorPostEntries,
  ];

  return sitemapEntries;
}