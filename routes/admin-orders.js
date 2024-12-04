const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const User = require('../models/User'); // Import the User model
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

// Admin - List all customers with orders
router.get('/customers', requireAdmin, (req, res) => {
    try {
        // Fetch all customers who have placed orders
        const customers = User.getAllUsersWithOrders(); // Replace with actual query logic
        res.render('layout', {
            view: 'admin-customer-orders', // Matches the EJS file name
            customers,
            user: req.session.user,
        });
    } catch (error) {
        console.error('Error fetching customers with orders:', error.message);
        res.status(500).send('Failed to fetch customers with orders.');
    }
});
// Admin - View specific customer's orders
router.get('/customers/:userId', requireAdmin, (req, res) => {
    try {
        const userId = req.params.userId;
        const customer = User.getUserById(userId); // Fetch customer details
        const orders = Order.getOrderHistory(userId); // Fetch their orders

        if (!customer) {
            req.flash('error', 'Customer not found.');
            return res.redirect('/admin/orders/customers');
        }

        res.render('layout', {
            view: 'admin-customer-orders-history', // Specific EJS file for this view
            orders,
            customer,
            user: req.session.user,
        });
    } catch (error) {
        console.error('Error fetching customer orders:', error.message);
        res.status(500).send('Failed to fetch customer orders');
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