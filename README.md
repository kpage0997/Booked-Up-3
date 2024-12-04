# Booked-Up-3

Welcome to **BookedUp**, your one-stop shop for discovering, browsing, and purchasing books! BookedUp is designed to provide users with an intuitive shopping experience featuring trending books, best sellers, and curated categories. Built with a focus on functionality and ease of use, this project is a demonstration of web development skills using modern tools and techniques.

---

## **Table of Contents**

- [About the Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-structure)
- [API Integration](#api-integration)


---

## **About the Project**

BookedUp is a full-stack e-commerce web application for book lovers. Users can browse books by categories, view trending and best-seller books, and easily manage their shopping cart. Admins can manage the inventory with features like adding, editing, and bulk-uploading books.

---

## **Features**

### **For Users**
- Browse books by category, best sellers, or featured selections.
- Add books to the cart and proceed to checkout.
- View order history and track purchases.

### **For Admins**
- Manage books: add, edit, or delete book listings.
- Bulk upload books via JSON files.
- View all user orders and order details.

---

## **Built With**

- **Frontend:**
  - HTML
  - CSS
  - Bootstrap 5
  - EJS (Embedded JavaScript Templates)

- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - SQLite (managed using `better-sqlite3`)

- **Other Tools:**
  - Multer (for file uploads)
  - dotenv (environment variables)
  - DB Browser for SQLite (database management)

---

## **Installation**

### Prerequisites
- Node.js (v14 or higher)
- Git
- DB Browser for SQLite (managing the database)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/BookedUp.git
   cd BookedUp

2. **Install Dependencies:**
   ```bash
   npm install

3. **Set up the databse:**
   ```bash
   node dbInit.js

3. **Start the development server:**
   ```bash
   node server.js

3. **Visit app in browser:**


## Database Schema

The database schema for the `BookedUp` project is as follows:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

## API Integration

### Open Library API Integration

This project integrates the **Open Library API** to fetch book details dynamically. Below are the details on how the API is used:
