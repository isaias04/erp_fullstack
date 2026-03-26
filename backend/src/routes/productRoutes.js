const express = require('express');
const router = express.Router();

const {getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    updateStock} = require('../controllers/productController');


router.get('/search' ,searchProducts);
router.get('/', getAllProducts);
router.get('/:id',getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/', createProduct);
router.patch('/:id/stock', updateStock);

module.exports = router;