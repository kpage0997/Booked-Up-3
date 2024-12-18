/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the Category class, which handles database operations related 
 * to book categories in the BookedUp project. It provides methods for retrieving, 
 * adding, and managing categories to organize books within the application.
 *
 */

const db = require("better-sqlite3")("./database/bookedup3.db");

class Category {
  // Get all categories
  static getAllCategories() {
    return db.prepare("SELECT * FROM categories").all();
  }

  //Get books by category name
  static getBooksByCategory(categoryName) {
    return db
      .prepare("SELECT * FROM books WHERE category = ?")
      .all(categoryName);
  }

  // Add a new category
  static addCategory(name) {
    db.prepare("INSERT INTO categories (name) VALUES (?)").run(name);
  }

  // Update a category
  static updateCategory(id, name) {
    db.prepare("UPDATE categories SET name = ? WHERE id = ?").run(name, id);
  }

  // Delete a category
  static deleteCategory(id) {
    db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  }
}

module.exports = Category;
