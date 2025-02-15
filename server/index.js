// server/index.js

const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

// Import your API routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import your Mongoose models (adjust paths/names as needed)
const Product = require('./models/productModel');
const Post = require('./models/postModel');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://adsh-client.vercel.app",
      "https://www.adsh2014.al",
      "https://adsh2014.al",
    ],
    credentials: true,
  })
);

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/products', productRoutes);

// Serve static files from the CRA build folder
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

/**
 * Catch-all route to inject dynamic OG meta tags.
 * It checks the requested URL and, if it matches a product or post detail page,
 * it queries the database and updates the meta tags accordingly.
 */
app.get('/*', async (req, res) => {
  // Set default meta tags (these come from your public/index.html)
  let dynamicMeta = {
    title: "ADSH",
    description: "Albanian Dairy & Supply Hub",
    image: "https://www.adsh2014.al/assets/Logo-Red.png",
  };

  const url = req.originalUrl;
  console.log("Requested URL:", url);

  try {
    // Handle product detail pages (excluding category pages)
    if (url.startsWith('/products/') && !url.startsWith('/products/category/')) {
      // Expecting URL pattern: /products/:slug
      const parts = url.split('/');
      const slug = parts[2]; // e.g. 'arome-djathi-dhie'
      const product = await Product.findOne({ slug: slug });
      if (product) {
        dynamicMeta.title = `ADSH - ${product.name}`;
        dynamicMeta.description = product.description || dynamicMeta.description;
        if (product.images && product.images.length > 0) {
          dynamicMeta.image = product.images[0];
        }
      }
    }
    // Handle post detail pages
    else if (url.startsWith('/posts/')) {
      // Expecting URL pattern: /posts/:id
      const parts = url.split('/');
      const postId = parts[2];
      const post = await Post.findById(postId);
      if (post) {
        dynamicMeta.title = `${post.title} | ADSH Blog`;
        dynamicMeta.description = post.description || dynamicMeta.description;
        if (post.thumbnail) {
          dynamicMeta.image = post.thumbnail;
        }
      }
    }
    // Optionally, handle category pages (e.g., /products/category/:category)
    else if (url.startsWith('/products/category/')) {
      const parts = url.split('/');
      const categorySlug = parts[3];
      dynamicMeta.title = `Products in category ${categorySlug}`;
      dynamicMeta.description = `Browse products in the ${categorySlug} category.`;
      // You can add a custom image if desired.
    }
  } catch (error) {
    console.error("Error fetching dynamic meta data:", error);
  }

  // Read the built index.html file
  const indexFile = path.join(buildPath, 'index.html');
  fs.readFile(indexFile, 'utf8', (err, htmlData) => {
    if (err) {
      console.error("Error reading index.html:", err);
      return res.status(500).send("Error reading index file");
    }

    // Replace meta tags in the HTML with our dynamic values.
    let modifiedHtml = htmlData
      .replace(/<title>[^<]*<\/title>/, `<title>${dynamicMeta.title}</title>`)
      .replace(/<meta property="og:title" content="[^"]*"\/?>/, `<meta property="og:title" content="${dynamicMeta.title}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\/?>/, `<meta property="og:description" content="${dynamicMeta.description}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\/?>/, `<meta property="og:image" content="${dynamicMeta.image}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\/?>/, `<meta name="twitter:title" content="${dynamicMeta.title}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\/?>/, `<meta name="twitter:description" content="${dynamicMeta.description}" />`)
      .replace(/<meta name="twitter:image" content="[^"]*"\/?>/, `<meta name="twitter:image" content="${dynamicMeta.image}" />`);

    res.send(modifiedHtml);
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
