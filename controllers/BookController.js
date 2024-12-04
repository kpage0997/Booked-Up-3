const Book = require('../models/Book');
const Category = require('../models/Category');

exports.getAllBooks = (req, res) => {
    const books = Book.getAllBooks();
    res.render('layout', { view: 'list', books, user: req.session.user });
};

exports.getBookById = (req, res) => {
    const book = Book.getBookById(req.params.id);
    if (book) {
        res.render('layout', { view: 'product', book, user: req.session.user });
    } else {
        res.status(404).send('Book not found');
    }
};

exports.getBooksByCategory = (req, res) => {
    const categoryId = req.params.categoryId;
    const books = Book.getBooksByCategory(categoryId);
    res.render('layout', { view: 'list', books, user: req.session.user });
};