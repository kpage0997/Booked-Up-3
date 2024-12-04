const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const Book = require('./models/Book');
const Category = require('./models/Category');

// Routers
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const booksRouter = require('./routes/books');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const categoryRouter = require('./routes/categories'); // New category router
const customerRouter = require('./routes/customers'); // Import the customer routes

// Load environment variables
dotenv.config();

const app = express();

// Middleware
// Serve static files
app.use(express.static('public'));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Session and flash middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret', // Fallback if .env not configured
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
    res.locals.message = req.flash('message'); // Set success messages
    res.locals.error = req.flash('error');     // Set error messages
    next();
});

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/books', booksRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/categories', categoryRouter); // Use the category router
app.use('/customers', customerRouter); // Use the customer routes

// Home page
app.get('/', (req, res) => {
    try {
        const categories = Category.getAllCategories(); // Fetch all categories
        const books = Book.getAllBooks(); // Assuming you have a Book model
        const featuredBooks = books.slice(0, 3); // Example: First 3 books
        const bestSellers = books.slice(0, 5); // Example: First 5 books

        res.render('layout', {
            view: 'home',
            categories,
            featuredBooks,
            bestSellers,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error fetching data for home page:', error.message);
        res.status(500).send('Failed to load home page');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).send('An internal server error occurred');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));