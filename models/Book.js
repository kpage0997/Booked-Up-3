const Database = require('better-sqlite3');
const db = new Database('./database/bookedup3.db');

class Book {
    // Retrieve all books
    static getAllBooks() {
        return db.prepare('SELECT * FROM books').all();
    }

    // Retrieve a book by ID
    static getBookById(id) {
        return db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    }

    //Get all categories
    static getCategories() {
        return db.prepare('SELECT DISTINCT category FROM books').all(); // Fetch all unique categories
    }

    // Retrieve books by category name
    static getBooksByCategoryName(categoryName) {
        return db.prepare('SELECT * FROM books WHERE category = ?').all(categoryName);
    }

    // Add a new book
    static addBook({ title, author, category, price, description, image_url }) {
        return db.prepare(`
            INSERT INTO books (title, author, category, price, description, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(title, author, category, parseFloat(price), description, image_url);
    }

    // Update an existing book
    static updateBook(id, { title, author, category, price, description, image_url }) {
        return db.prepare(`
            UPDATE books
            SET title = ?, author = ?, category = ?, price = ?, description = ?, image_url = ?
            WHERE id = ?
        `).run(title, author, category, parseFloat(price), description, image_url, id);
    }

    // Delete a book
    static deleteBook(id) {
        return db.prepare('DELETE FROM books WHERE id = ?').run(id);
    }

    static getFeaturedBooks() {
        return db.prepare('SELECT * FROM books LIMIT 3').all(); // Get the first 3 books
    }

    static getBestSellers() {
        return db.prepare('SELECT * FROM books LIMIT 5').all(); // Get the first 5 books
    }

    
}

module.exports = Book;