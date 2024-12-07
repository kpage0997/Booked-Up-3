/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file contains utility functions for the BookedUp project. These functions 
 * perform common tasks such as formatting API data or handling reusable logic 
 * to simplify and streamline other parts of the application.
 *
 */

// Utility functions for formatting API books

// Format a single API book
const formatApiBook = (apiBook) => {
  if (!apiBook || typeof apiBook !== "object") {
    console.error("Invalid input to formatApiBook. Received:", apiBook);
    throw new Error("Invalid input to formatApiBook. Expected an object.");
  }

  const authors =
    apiBook.authors && Array.isArray(apiBook.authors)
      ? apiBook.authors.map((author) => author.name).join(", ")
      : apiBook.author_name && Array.isArray(apiBook.author_name)
      ? apiBook.author_name.join(", ")
      : "Unknown Author";

  return {
    id: null, // API books don't have a database ID
    key: apiBook.key || null,
    title: apiBook.title || "Unknown Title",
    author: apiBook.authors
      ? apiBook.authors.map((a) => a.name).join(", ")
      : "Unknown Author",
    price: parseFloat((Math.random() * 50).toFixed(2)), // Random price for API books
    image_url: apiBook.cover_i
      ? `https://covers.openlibrary.org/b/id/${apiBook.cover_i}-L.jpg`
      : "/images/default.jpg", // Default image for missing covers
    description: apiBook.description || "No description available.",
    category: "API Books",
  };
};

// Format multiple API books
const formatApiBooks = (apiBooks) => {
  if (!Array.isArray(apiBooks)) {
    console.error("Invalid input to formatApiBooks. Received:", apiBooks);
    throw new Error("Invalid input to formatApiBooks. Expected an array.");
  }

  return apiBooks.map((book) => ({
    id: null, // API books won't have a database ID
    key: book.key,
    title: book.title || "Unknown Title",
    price: parseFloat((Math.random() * 50).toFixed(2)), // Generate a random price
    author_name: book.author_name ? book.author_name.join(", ") : "Unknown", // Combine author names
    first_publish_year: book.first_publish_year || "Unknown", // Handle missing published year
    cover_i: book.cover_i || null, // Cover ID for images
    image_url: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : "/images/default.jpg", // Default image
    description: book.description || "No description available.",
    category: book.subject ? book.subject[0] : "Uncategorized",
  }));
};

module.exports = { formatApiBook, formatApiBooks };
