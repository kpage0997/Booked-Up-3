const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const Category = require('../models/Category'); // Import Category model

// List all categories
router.get('/', requireAdmin, (req, res) => {
    try {
        const categories = Category.getAllCategories();
        res.render('layout', { view: 'admin-categories', categories, user: req.session.user });
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).send('Failed to load categories page');
    }
});

// Add a new category
router.post('/add', requireAdmin, (req, res) => {
    const { name } = req.body;

    try {
        Category.addCategory(name);
        req.session.message = 'Category added successfully!';
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Error adding category:', error.message);
        res.status(500).send('Failed to add category');
    }
});

// Edit category
router.post('/edit/:id', requireAdmin, (req, res) => {
    const { name } = req.body;

    try {
        Category.updateCategory(req.params.id, name);
        req.session.message = 'Category updated successfully!';
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Error updating category:', error.message);
        res.status(500).send('Failed to update category');
    }
});

// Delete category
router.post('/delete/:id', requireAdmin, (req, res) => {
    try {
        Category.deleteCategory(req.params.id);
        req.session.message = 'Category deleted successfully!';
        res.redirect('/admin/categories');
    } catch (error) {
        console.error('Error deleting category:', error.message);
        res.status(500).send('Failed to delete category');
    }
});

module.exports = router;