const express = require('express');
const { body, query } = require('express-validator');
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long'),
  body('sku').optional().trim().isLength({ max: 50 }).withMessage('SKU too long'),
  body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
];

router.use(protect);

router.get('/categories', getCategories);

router.route('/')
  .get([
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be >= 0'),
  ], getProducts)
  .post(productValidation, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(productValidation, updateProduct)
  .delete(deleteProduct);

module.exports = router;

