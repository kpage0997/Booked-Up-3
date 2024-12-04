const db = require('better-sqlite3')('./database/bookedup3.db');

class Category {
    // Get all categories
    static getAllCategories() {
        return db.prepare('SELECT * FROM categories').all();
    }

    //Get books by category name
    static getBooksByCategory(categoryName) {
        return db.prepare('SELECT * FROM books WHERE category = ?').all(categoryName);
    }

    // Add a new category
    static addCategory(name) {
        db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    }

    // Update a category
    static updateCategory(id, name) {
        db.prepare('UPDATE categories SET name = ? WHERE id = ?').run(name, id);
    }

    // Delete a category
    static deleteCategory(id) {
        db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    }
}

module.exports = Category;