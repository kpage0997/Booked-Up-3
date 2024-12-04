const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');

// Connect to the database
const db = new Database('./database/bookedup3.db');

// Middleware to ensure the user is logged in
function ensureLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// Order History Route
router.get('/history', ensureLoggedIn, (req, res) => {
    const userId = req.session.user.id;

    try {
        const orders = Order.getOrderHistory(userId);

        res.render('layout', {
            view: 'history',
            orders,
            user: req.session.user,
            message: res.locals.message || null,
        });
    } catch (error) {
        console.error('Error fetching order history:', error.message);
        res.status(500).send('An error occurred while fetching your order history.');
    }
});
module.exports = router;