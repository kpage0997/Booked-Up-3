/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file is responsible for initializing the database for the BookedUp project.
 * It defines the database schema, creates necessary tables, and seeds initial data 
 * if required. This ensures the database is properly set up and ready for use by the 
 * application.
 * 
 */

const Database = require("better-sqlite3");
const db = new Database("./database/bookedup3.db", { verbose: console.log });

db.exec(`

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer'))
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    priority INTEGER DEFAULT 0
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

`);

console.log("Tables created successfully.");

// Insert Default Categories
db.exec(`
INSERT OR IGNORE INTO categories (name, priority)
VALUES
    ('Fiction', 1),
    ('Non-Fiction', 2),
    ('Science Fiction', 3),
    ('Biography', 4),
    ('Mystery', 5);
`);

// Insert Default Users
db.exec(`
INSERT OR IGNORE INTO users (username, password, role)
VALUES
    ('admin', 'admin123', 'admin'),
    ('user1', 'password1', 'customer');
`);

console.log("Default data inserted!");
console.log("Database initialized!");

module.exports = db;
