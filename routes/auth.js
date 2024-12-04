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
    res.render('layout', { view: 'login', user: req.session.user || null });
});

// Login POST request
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Username and password are required');
    }

    // Trim input to avoid leading/trailing whitespace issues
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
        // Query the database for the user
        const user = db
            .prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?')
            .get(trimmedUsername, trimmedPassword);

        if (user) {
            req.session.user = user; // Save user to session
            res.redirect(user.role === 'admin' ? '/admin' : '/');
        } else {
            res.send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('An error occurred. Please try again later.');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err.message);
            return res.status(500).send('Logout failed.');
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;