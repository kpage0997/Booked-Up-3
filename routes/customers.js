const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Customer Dashboard
router.get('/dashboard', (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        req.flash('error', 'You must be logged in to view your dashboard.');
        return res.redirect('/auth/login');
    }

    try {
        const orderHistory = Order.getOrderHistory(userId); // Fetch the customer's orders
        const cart = req.session.cart || []; // Fetch the current cart

        res.render('layout', {
            view: 'customer-dashboard',
            user: req.session.user,
            orderHistory,
            cart,
        });
    } catch (error) {
        console.error('Error loading customer dashboard:', error.message);
        res.status(500).send('Failed to load customer dashboard.');
    }
});

module.exports = router;