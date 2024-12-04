const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Import the Book model

// Get all books
router.get('/', (req, res) => {
    try {
        const books = Book.getAllBooks(); // Fetch all books from the database
        res.render('layout', { view: 'list', books, user: req.session.user || null });
    } catch (error) {
        console.error('Error retrieving books:', error.message);
        res.status(500).send('Failed to retrieve books');
    }
});

// Get book by ID
router.get('/:id', (req, res) => {
    try {
        const book = Book.getBookById(req.params.id); // Fetch book by its ID

        if (book) {
            res.render('layout', { view: 'product', book, user: req.session.user || null });
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error retrieving book:', error.message);
        res.status(500).send('Failed to retrieve book');
    }
});

// Get books by category
router.get('/category/:category', (req, res) => {
    try {
        const books = Book.getBooksByCategory(req.params.category); // Fetch books by category

        if (books.length > 0) {
            res.render('layout', { view: 'list', books, user: req.session.user || null });
        } else {
            res.status(404).send('No books found in this category');
        }
    } catch (error) {
        console.error('Error retrieving books by category:', error.message);
        res.status(500).send('Failed to retrieve books by category');
    }
});

module.exports = router;