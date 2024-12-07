/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing and displaying book categories in the BookedUp project.
 * It allows users to view all available categories and browse books by category.
 *
 */

const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Book = require("../models/Book"); // Assuming categories are in the books table
const { getBooksByCategory } = require("../api/openLibrary");
const axios = require("axios");

// Get all categories
router.get("/", (req, res) => {
  try {
    const categories = Book.getCategories(); // Fetch unique categories from books table
    res.render("layout", {
      view: "categories",
      categories,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).send("Failed to fetch categories");
  }
});

// Route to get books by category
router.get("/:category", async (req, res) => {
  const category = req.params.category;
  const page = parseInt(req.query.page) || 1; // Get the current page from query or default to 1
  const MAX_PAGES = 10; // Limit total pages to 10
  const ITEMS_PER_PAGE = 12;

  try {
    // Fetch books from the Open Library API using the category as a query
    const response = await axios.get(
      `https://openlibrary.org/search.json?subject=${encodeURIComponent(
        category
      )}`
    );

    const totalBooks = response.data.docs.length;
    const totalPages = Math.min(
      Math.ceil(totalBooks / ITEMS_PER_PAGE),
      MAX_PAGES
    );
    // Limit to 10 pages
    const books = response.data.docs.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    ); // Get books for the current page

    const formattedBooks = books.map((book) => ({
      key: book.key,
      title: book.title || "Unavailable",
      author_name: book.author_name || [],
      cover_i: book.cover_i || null,
    }));

    res.render("layout", {
      view: "category-books",
      books: formattedBooks,
      category,
      currentPage: page,
      totalPages,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error("Error fetching books by category:", error.message);
    res.status(500).send("Failed to fetch books for this category.");
  }
});

module.exports = router;
