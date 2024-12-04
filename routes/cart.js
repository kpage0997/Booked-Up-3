const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const ensureCart = require('../middleware/cart');

// Apply middleware to initialize the cart
router.use(ensureCart);

// Display cart
router.get('/', (req, res) => {
    const cart = req.session.cart;
    res.render('layout', { view: 'cart', cart, user: req.session.user });
});

// Add item to cart
router.post('/add', (req, res) => {
    const { id, title, price, quantity } = req.body;
    const existingItem = req.session.cart.find(item => item.id === parseInt(id, 10));

    if (existingItem) {
        existingItem.quantity += parseInt(quantity, 10);
    } else {
        req.session.cart.push({
            id: parseInt(id, 10),
            title,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
        });
    }

    req.session.message = 'Item added to cart!';
    res.redirect('/cart');
});

// Confirm Checkout
router.post('/checkout', (req, res) => {
    const userId = req.session.user?.id;
    const cart = req.session.cart || [];

    if (!userId) {
        req.flash('error', 'You must be logged in to place an order.');
        return res.redirect('/auth/login');
    }

    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty.');
        return res.redirect('/cart');
    }

    try {
        const orderId = Order.placeOrder(userId, cart); // Capture the orderId
        req.session.cart = []; // Clear the cart
        req.flash('message', 'Order placed successfully!');
        res.redirect(`/orders/confirmation/${orderId}`); // Pass orderId to the confirmation route
    } catch (error) {
        console.error('Error processing order:', error.message);
        res.status(500).send('An error occurred while placing the order.');
    }
});

// Checkout page
router.get('/checkout', (req, res) => {
    const cart = req.session.cart;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.render('layout', {
        view: 'checkout',
        cart,
        total,
        user: req.session.user || null,
    });
});

// Remove item from cart
router.get('/remove/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    req.session.cart = req.session.cart.filter(item => item.id !== itemId);
    req.session.message = 'Item removed from cart!';
    res.redirect('/cart');
});

module.exports = router;