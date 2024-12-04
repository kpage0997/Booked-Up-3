const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Book = require('../models/Book'); // Assuming categories are in the books table

// Get all categories
router.get('/', (req, res) => {
    try {
        const categories = Book.getCategories(); // Fetch unique categories from books table
        res.render('layout', { view: 'categories', categories, user: req.session.user });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Failed to fetch categories');
    }
});

// Get books by category name
router.get('/:name', (req, res) => {
    try {
        const categoryName = req.params.name; // Get the category name from the URL
        const books = Book.getBooksByCategoryName(categoryName); // Fetch books by category name

        if (!books.length) {
            return res.render('layout', {
                view: 'books-by-category',
                books: [],
                message: `No books found for the "${categoryName}" category.`,
                user: req.session.user,
            });
        }

        res.render('layout', {
            view: 'books-by-category',
            books,
            categoryName,
            user: req.session.user,
        });
    } catch (error) {
        console.error('Error fetching books by category:', error.message);
        res.status(500).send('Failed to fetch books by category');
    }
});

module.exports = router;