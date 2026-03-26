const express = require('express');
const router = express.Router();

const {
    getAllSales,
    getSaleById,
    createSale,
    getSalesStats
} = require('../controllers/SalesController');

// IMPORTANTE: /stats ANTES de /:id para que Express no confunda "stats" con un ID
router.get('/stats', getSalesStats);
router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', createSale);

module.exports = router;
