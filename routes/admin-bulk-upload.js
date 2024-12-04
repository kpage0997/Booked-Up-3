// Import necessary dependencies
const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth'); // Ensure only admins can access
const upload = require('../middleware/multer'); // Import multer for file uploads
const fs = require('fs');
const Book = require('../models/Book');


// Render the Bulk Upload Form
router.get('/', requireAdmin, (req, res) => {
    res.render('layout', { view: 'admin-bulk-upload', user: req.session.user });
});

// Handle Bulk Upload JSON File
router.post('/', requireAdmin, upload.single('jsonFile'), (req, res) => {
    const filePath = req.file?.path;

    if (!filePath) {
        req.flash('error', 'No file uploaded!');
        return res.redirect('/admin/bulk-upload');
    }

    try {
        const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        if (!Array.isArray(jsonData)) {
            throw new Error('Invalid JSON format. Expected an array of products.');
        }

        jsonData.forEach(product => {
            const { title, author, category, price, description, image_url } = product;
            Book.addBook({ title, author, category, price, description, image_url });
        });

        req.flash('message', 'Products uploaded successfully!');
    } catch (error) {
        console.error('Error processing bulk upload:', error.message);
        req.flash('error', 'Failed to upload products. Ensure the JSON file format is correct.');
    } finally {
        fs.unlinkSync(filePath); // Remove the uploaded file
        res.redirect('/admin/bulk-upload');
    }
});

module.exports = router;