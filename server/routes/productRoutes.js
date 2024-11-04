// routes/productRoutes.js

const { Router } = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  getCategoryProducts,
  editProduct,
  deleteProduct,
} = require('../controllers/productControllers');

const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory for Vercel Blob
const upload = multer({ storage });

const router = Router();

// Routes
router.post('/', authMiddleware, upload.array('images', 5), createProduct);
router.get('/', getProducts);
router.get('/categories/:category', getCategoryProducts);
router.get('/slug/:slug', getProduct); // Fetch by slug
router.patch('/slug/:slug/edit', authMiddleware, upload.array('images', 5), editProduct);
router.delete('/slug/:slug', authMiddleware, deleteProduct); // Delete by slug

module.exports = router;
