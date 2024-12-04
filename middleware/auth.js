const express = require('express');
const session = require('express-session');
const db = require('better-sqlite3')('./database/bookedup3.db');
const router = express.Router();

// Middleware to ensure the user is logged in
const requireLogin = (req, res, next) => {
    if (req.session.user) {
        next(); // User is logged in, proceed
    } else {
        res.redirect('/auth/login'); // Redirect to login page
    }
};

// Middleware to ensure the user is an admin
const requireAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next(); // User is admin, proceed
    } else {
        res.redirect('/auth/login'); // Redirect to login page
    }
};

module.exports = { requireLogin, requireAdmin };