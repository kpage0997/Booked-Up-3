/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing and displaying books in the BookedUp project.
 * It integrates data from the database and the Open Library API to provide features 
 * such as listing, searching, and viewing book details. It also includes CRUD 
 * operations for managing books.
 *
 */

const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // Import the Book model
const {
  searchBooks,
  getBookByISBN,
  getBookByKey,
  getBooksByCategory,
} = require("../api/openLibrary");
const { formatApiBook, formatApiBooks } = require("../util");
const axios = require("axios");

// Get all books with database and API integration
// Get all books (database and API integration)
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 16; // Limit per page
  const offset = (page - 1) * limit;

  try {
    // Fetch books from the database
    const dbBooks = Book.getAllBooks();
    const dbBookCount = dbBooks.length;

    let books = [];
    let remainingLimit = limit - dbBookCount;

    if (dbBookCount >= limit) {
      // Only database books are enough to fill the page
      books = dbBooks.slice(offset, offset + limit);
    } else {
      // Need API books to fill the remaining space
      const apiOffset = Math.max(0, offset - dbBookCount);
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=book&offset=${apiOffset}&limit=${remainingLimit}`
      );
      const apiBooks = response.data.docs;

      // Format API books and combine with database books
      const formattedApiBooks = formatApiBooks(apiBooks);
      books = [...dbBooks.slice(offset), ...formattedApiBooks];
    }

    // Total pages based on books in the database + API books (capped at 160 API books)
    const totalBooks = Math.min(dbBookCount + 160, 160);
    const totalPages = Math.ceil(totalBooks / limit);

    res.render("layout", {
      view: "list",
      books,
      user: req.session.user || null,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    req.session.error = "Failed to fetch books.";
    res.redirect("/");
  }
});

// Search for books
router.get("/search", async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 16;
  const offset = (page - 1) * limit;

  try {
    // Fetch API books
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query
      )}&offset=${offset}&limit=${limit}`
    );

    const apiBooks = response.data.docs.map(formatApiBook);

    res.render("layout", {
      view: "search-results",
      books: apiBooks,
      query,
      user: req.session.user || null,
      currentPage: page,
      totalPages: Math.ceil(response.data.numFound / limit),
    });
  } catch (error) {
    console.error("Error fetching search results:", error.message);
    req.session.error = "Failed to fetch search results.";
    res.redirect("/books");
  }
});

// Get book by ID or Key
// Get book by ID or Key
router.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  try {
    let book;

    // Check if the identifier is numeric (database ID)
    if (/^\d+$/.test(identifier)) {
      book = Book.getBookById(identifier); // Fetch from database
    }

    if (!book) {
      // If not found in database, treat as API key
      console.log(`Fetching book by API key: ${identifier}`);
      const response = await axios.get(
        `https://openlibrary.org/works/${identifier}.json`
      );
      book = formatApiBook(response.data); // Format API book data
    }

    if (!book) {
      throw new Error("Book not found in database or API.");
    }

    res.render("layout", {
      view: "product",
      book,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    req.session.error = "Failed to fetch book details.";
    res.redirect("/books");
  }
});

// Add a new book to the database
router.post("/add", (req, res) => {
  const { title, author, category, price, description, image_url } = req.body;

  try {
    Book.addBook({ title, author, category, price, description, image_url });
    req.session.message = "Book added successfully!";
    res.redirect("/books");
  } catch (error) {
    console.error("Error adding book:", error.message);
    req.session.error = "Failed to add book.";
    res.redirect("/books");
  }
});

// Edit an existing book
router.post("/edit/:id", (req, res) => {
  const { title, author, category, price, description, image_url } = req.body;

  try {
    Book.updateBook(req.params.id, {
      title,
      author,
      category,
      price,
      description,
      image_url,
    });
    req.session.message = "Book updated successfully!";
    res.redirect("/books");
  } catch (error) {
    console.error("Error updating book:", error.message);
    req.session.error = "Failed to update book.";
    res.redirect(`/books/edit/${req.params.id}`);
  }
});

// Delete a book
router.post("/delete/:id", (req, res) => {
  try {
    Book.deleteBook(req.params.id);
    req.session.message = "Book deleted successfully!";
    res.redirect("/books");
  } catch (error) {
    console.error("Error deleting book:", error.message);
    req.session.error = "Failed to delete book.";
    res.redirect("/books");
  }
});

module.exports = router;
