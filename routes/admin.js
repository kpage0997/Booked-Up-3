const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

// Admin dashboard
router.get('/', requireAdmin, (req, res) => {
    res.render('layout', { view: 'admin-dashboard', user: req.session.user });
});

// Delegate books and categories routes
router.use('/books', require('./admin-books')); // Book management routes
router.use('/categories', require('./admin-categories')); // Category management routes
router.use('/orders', require('./admin-orders')); // Add orders route
router.use('/bulk-upload', require('./admin-bulk-upload'));

module.exports = router;