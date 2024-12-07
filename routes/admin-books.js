/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing books in the admin section of the BookedUp project.
 * It provides functionality for listing, adding, editing, and deleting books, 
 * with access restricted to admin users.
 *
 */

const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const upload = require("../middleware/multer");
const Book = require("../models/Book"); // Import Book model

// List all books
router.get("/", requireAdmin, (req, res) => {
  try {
    const books = Book.getAllBooks();
    res.render("layout", {
      view: "admin-books",
      books,
      user: req.session.user,
      message: req.query.message || null,
      error: req.query.error || null,
    });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).send("Failed to load books management page");
  }
});

// Add a new book
router.post("/add", requireAdmin, upload.single("image"), (req, res) => {
  const { title, author, category, price, description } = req.body;
  const image_url = req.file ? `/images/${req.file.filename}` : null;

  try {
    Book.addBook({ title, author, category, price, description, image_url });
    res.redirect("/admin/books?message=Book added successfully!");
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.redirect("/admin/books?error=Failed to add book.");
  }
});

// Edit book form
router.get("/edit/:id", requireAdmin, (req, res) => {
  try {
    const product = Book.getBookById(req.params.id); // Fetch product by ID
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("layout", {
      view: "admin-edit",
      product,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).send("Failed to load edit form");
  }
});

// Edit book
router.post("/edit/:id", requireAdmin, upload.single("image"), (req, res) => {
  const { title, author, category, price, description } = req.body;

  // Use the uploaded file if provided; otherwise, use the existing image
  const image_url = req.file
    ? `/images/${req.file.filename}`
    : req.body.existingImage;

  try {
    Book.updateBook(req.params.id, {
      title,
      author,
      category,
      price,
      description,
      image_url,
    });
    res.redirect("/admin/books?message=Book updated successfully!");
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.redirect(
      `/admin/books/edit/${req.params.id}?error=Failed to update book.`
    );
  }
});

// Delete book
router.post("/delete/:id", requireAdmin, (req, res) => {
  try {
    Book.deleteBook(req.params.id);
    res.redirect("/admin/books?message=Book deleted successfully!");
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.redirect("/admin/books?error=Failed to delete book.");
  }
});

module.exports = router;
