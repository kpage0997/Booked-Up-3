/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file is the entry point for the BookedUp project. It sets up the Express server, 
 * configures middleware, and defines the main routes for handling requests. 
 * It integrates with the view engine, session management, and other features 
 * required for the application.
 *
 */

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const Book = require("./models/Book");
const Category = require("./models/Category");
const { getFeaturedBooks, getBookByKey } = require("./api/openLibrary");
const { getCategories } = require("./api/openLibrary");
const axios = require("axios");
const db = require("./database/dbInit");

// Routers
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const booksRouter = require("./routes/books");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const categoryRouter = require("./routes/categories"); // New category router
const customerRouter = require("./routes/customers"); // Import the customer routes

// Load environment variables
dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret", // Use a secret from .env
    resave: false, // Avoid unnecessary session saving
    saveUninitialized: false, // Do not save uninitialized sessions
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to handle flash-like messages
app.use((req, res, next) => {
  res.locals.message = req.session.message || null;
  res.locals.error = req.session.error || null;

  // Clear the session variables after displaying
  delete req.session.message;
  delete req.session.error;

  next();
});

// Middleware
// Serve static files
app.use(express.static("public"));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Custom middleware for global variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Add user to locals for all views
  res.locals.message = req.session.message || null;
  // Clear the session variables after displaying
  delete req.session.message;
  delete req.session.error;
  next();
});

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/books", booksRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/categories", categoryRouter); // Use the category router
app.use("/customers", customerRouter); // Use the customer routes

const categories = [
  { name: "Science Fiction" },
  { name: "Fantasy" },
  { name: "Romance" },
  { name: "Mystery" },
  { name: "Non-Fiction" },
  { name: "History" },
];

// Helper function to truncate descriptions
app.locals.truncateDescription = (description, length = 150) => {
  if (!description) return "No description available";
  return description.length > length
    ? description.substring(0, length) + "..."
    : description;
};

// Home page
app.get("/", async (req, res) => {
  try {
    // Fetch books
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=popular`
    );
    const books = response.data.docs;

    // Filter books with covers and descriptions
    const filteredBooks = books.filter((book) => book.cover_i && book.title);

    // Format books for featured and bestsellers
    const featuredBooks = filteredBooks.slice(0, 4).map((book) => ({
      title: book.title,
      description: book.first_sentence
        ? book.first_sentence.value
        : "No description available",
      image_url: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
      key: book.key,
    }));

    const bestSellers = filteredBooks.slice(4, 8).map((book) => ({
      title: book.title,
      author: book.author_name ? book.author_name[0] : "Unknown Author",
      image_url: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
      key: book.key,
    }));

    // Render home page
    res.render("layout", {
      view: "home",
      featuredBooks,
      bestSellers,
      categories: [
        { name: "Science" },
        { name: "Fiction" },
        { name: "History" },
        { name: "Art" },
        { name: "Technology" },
      ],
      user: req.session.user || null,
    });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).send("Failed to load homepage.");
  }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
