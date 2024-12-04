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
    const cart = req.session.cart;

    if (!userId) return res.status(401).send('You must be logged in to place an order.');
    if (cart.length === 0) return res.status(400).send('Your cart is empty.');

    try {
        Order.placeOrder(userId, cart);
        req.session.cart = [];
        req.session.message = 'Order placed successfully!';
        res.redirect('/orders/history');
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