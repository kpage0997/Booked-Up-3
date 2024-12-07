/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 * 
 * Handles integration with the Open Library API for searching, retrieving, and displaying book data.
 * Provides functions for searching books, fetching book details, and retrieving categories and featured books.
 * 
 */

const axios = require("axios");
const BASE_URL = "https://openlibrary.org";

// Search for books with pagination
async function searchBooks(query, page = 1, booksPerPage = 20) {
    try {
        const offset = (page - 1) * booksPerPage; // Calculate offset
        const url = `${BASE_URL}/search.json?title=${encodeURIComponent(query)}&limit=${booksPerPage}&offset=${offset}`;
        console.log('Fetching:', url);
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error.message);
        throw error;
    }
}
// Get book details by ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}.json`);
    return response.data; // Return the book details
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    throw error;
  }
}

function cleanDescription(description) {
  if (!description) return "Description not available";
  if (typeof description === "string")
    return description.split("[source]")[0].trim();
  if (description.value) return description.value.split("[source]")[0].trim();
  return "Description not available";
}

// Get book details by key
async function getBookByKey(key) {
  try {
    // Use the `key` directly
    const response = await axios.get(`https://openlibrary.org/works/${key}.json`);
    const book = response.data;

    const authors = [];
    if (book.authors && Array.isArray(book.authors)) {
      for (const author of book.authors) {
        try {
          const authorResponse = await axios.get(
            `https://openlibrary.org${author.author.key}.json`
          );
          authors.push({ name: authorResponse.data.name || "Unknown" });
        } catch (authorError) {
          console.error(
            `Error fetching author ${author.author.key}:`,
            authorError.message
          );
          authors.push({ name: "Unknown" });
        }
      }
    }

    return {
      title: book.title || "Unavailable",
      covers: book.covers || [],
      authors, // Always an array
      isbn: Array.isArray(book.identifiers?.isbn_10)
        ? book.identifiers.isbn_10
        : ["Unavailable"],
      publish_date: book.created?.value || "Unavailable",
      description: cleanDescription(book.description), // Cleaned description
    };
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    throw error;
  }
}

async function getFeaturedBooks(limit) {
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=popular`
    );

    // Filter books to include only those with covers
    const booksWithCovers = response.data.docs.filter((book) => book.cover_i);

    // Limit the number of books and map the data for rendering
    return booksWithCovers.slice(0, limit).map((book) => ({
      title: book.title || "Unavailable",
      author: book.author_name ? book.author_name.join(", ") : "Unknown",
      description: book.first_sentence
        ? typeof book.first_sentence === "string"
          ? book.first_sentence
          : book.first_sentence.value
        : "No description available",
      image_url: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
      key: book.key,
    }));
  } catch (error) {
    console.error("Error fetching featured books:", error.message);
    return [];
  }
}

async function getBooksByCategory(category, limit = 10) {
  try {
    const response = await axios.get(
      `${BASE_URL}/subjects/${encodeURIComponent(category)}.json?limit=${limit}`
    );
    return response.data.works.map((work) => ({
      key: work.key,
      title: work.title || "Unavailable",
      cover_id: work.cover_id || null,
      author: work.authors?.[0]?.name || "Unknown Author",
      description: work.description?.value || "Description not available",
    }));
  } catch (error) {
    console.error(
      `Error fetching books for category ${category}:`,
      error.message
    );
    return [];
  }
}

async function getCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/subjects.json`);
    return response.data.subjects.map((subject) => ({
      name: subject.name,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
}


module.exports = { searchBooks, getBookByISBN, getBookByKey, getFeaturedBooks, getBooksByCategory, getCategories };
