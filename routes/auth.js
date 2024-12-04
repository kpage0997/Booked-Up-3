const express = require('express');
const session = require('express-session');
const path = require('path');
const Database = require('better-sqlite3');
// Uncomment the following line to use bcrypt for hashing passwords in the future.
// const bcrypt = require('bcrypt');

const dbPath = path.resolve('./database/bookedup3.db'); // Resolve the path to the database
console.log('Using database file:', dbPath); // Debugging to confirm the correct file is used
const db = new Database(dbPath); // Initialize the database connection
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
    const { message, error } = req.query; // Get messages from query params
    res.render('layout', {
        view: 'login',
        user: req.session.user || null,
        message,
        error,
    });
});

// Login POST request
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect('/auth/login?error=Username and password are required.');
    }

    try {
        const user = db
            .prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?')
            .get(username.trim(), password.trim());

        if (user) {
            req.session.user = user;
            return res.redirect(user.role === 'admin' ? '/admin?message=Welcome, Admin!' : '/?message=You have successfully logged in!');
        } else {
            return res.redirect('/auth/login?error=Invalid username or password.');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.redirect('/auth/login?error=An error occurred. Please try again later.');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err.message);
            return res.redirect('/?error=An error occurred during logout. Please try again.');
        }
        return res.redirect('/auth/login?message=You have successfully logged out!');
    });
});

module.exports = router;