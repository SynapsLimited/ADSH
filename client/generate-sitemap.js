// generateSitemap.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Base domain URL (replace with your actual domain)
const baseUrl = 'https://www.adsh2014.al';
// Today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Load categories data from a local JSON file
const categories = require('./data/categories.json');

async function generateSitemap() {
  const urls = [
    // Static routes
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/products`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${baseUrl}/privacy-policy`, changefreq: 'yearly', priority: '0.5' }
  ];

  // Fetch dynamic product routes from your backend API
  try {
    const { data: products } = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`);
    console.log(`Fetched ${products.length} products`);
    products.forEach((product) => {
      if (product.slug) {
        urls.push({
          loc: `${baseUrl}/products/${product.slug}`,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Fetch dynamic blog post routes from your backend API
  try {
    const { data: posts } = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
    console.log(`Fetched ${posts.length} blog posts`);
    posts.forEach((post) => {
      // Use _id (or fallback to id) as posts are id-based in the URL
      const postIdentifier = post._id || post.id;
      if (postIdentifier) {
        urls.push({
          loc: `${baseUrl}/posts/${postIdentifier}`,
          changefreq: 'weekly',
          priority: '0.7'
        });
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }

  // Add static product category pages from local categories data
  if (Array.isArray(categories)) {
    categories.forEach((category) => {
      // Category page URL: /products/category/:slug
      urls.push({
        loc: `${baseUrl}/products/category/${category.slug}`,
        changefreq: 'weekly',
        priority: '0.8'
      });

      // For each subcategory (if any)
      if (Array.isArray(category.subcategories) && category.subcategories.length > 0) {
        category.subcategories.forEach((subcategory) => {
          urls.push({
            loc: `${baseUrl}/products/category/${category.slug}/subcategory/${subcategory.slug}`,
            changefreq: 'weekly',
            priority: '0.7'
          });
        });
      }
    });
  } else {
    console.warn('Categories data is not an array.');
  }

  // Build XML content for sitemap.xml
  const xmlUrls = urls
    .map(
      (urlObj) => `
  <url>
    <loc>${urlObj.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${urlObj.changefreq}</changefreq>
    <priority>${urlObj.priority}</priority>
  </url>`
    )
    .join('');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${xmlUrls}
</urlset>`;

  // Write the sitemap.xml to the public folder
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml);
  console.log('Sitemap generated successfully at:', sitemapPath);

  // Generate robots.txt content including backend/admin routes
  const robotsTxt = `User-agent: *
Allow: /

# Disallow backend/admin routes
Disallow: /register
Disallow: /login
Disallow: /profile
Disallow: /create
Disallow: /posts/*/edit
Disallow: /posts/*/delete
Disallow: /myposts
Disallow: /products-dashboard
Disallow: /create-product
Disallow: /products/*/delete
Disallow: /products/*/edit

Sitemap: ${baseUrl}/sitemap.xml
`;
  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log('robots.txt generated successfully at:', robotsPath);
}

generateSitemap();
