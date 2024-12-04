const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const Order = require('../models/Order'); // Import the Order model

// Admin - View all orders
router.get('/', requireAdmin, (req, res) => {
    try {
        const orders = Order.getAllOrders(); // Fetch all orders
        res.render('layout', { view: 'admin-orders', orders, user: req.session.user });
    } catch (error) {
        console.error('Error fetching order history:', error.message);
        res.status(500).send('Failed to fetch order history');
    }
});

// Admin - View specific order details
router.get('/:id', requireAdmin, (req, res) => {
    try {
        const orderDetails = Order.getOrderDetails(req.params.id); // Fetch details of a specific order
        res.render('layout', { view: 'order-details', orderDetails, user: req.session.user });
    } catch (error) {
        console.error('Error fetching order details:', error.message);
        res.status(500).send('Failed to fetch order details');
    }
});

module.exports = router;