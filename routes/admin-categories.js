/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing book categories in the admin section of the BookedUp project.
 * It allows admin users to create, edit, and delete categories, ensuring books are organized 
 * for easy browsing and management.
 *
 */

const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const Category = require("../models/Category"); // Import Category model

// List all categories
router.get("/", requireAdmin, (req, res) => {
  try {
    const categories = Category.getAllCategories();
    const message = req.query.message || null;
    const error = req.query.error || null;

    res.render("layout", {
      view: "admin-categories",
      categories,
      user: req.session.user,
      message,
      error,
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).send("Failed to load categories page");
  }
});

// Add a new category
router.post("/add", requireAdmin, (req, res) => {
  const { name } = req.body;

  try {
    Category.addCategory(name);
    res.redirect("/admin/categories?message=Category added successfully!");
  } catch (error) {
    console.error("Error adding category:", error.message);
    res.redirect("/admin/categories?error=Failed to add category");
  }
});

// Edit category
router.post("/edit/:id", requireAdmin, (req, res) => {
  const { name } = req.body;

  try {
    Category.updateCategory(req.params.id, name);
    res.redirect("/admin/categories?message=Category updated successfully!");
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.redirect("/admin/categories?error=Failed to update category");
  }
});

// Delete category
router.post("/delete/:id", requireAdmin, (req, res) => {
  try {
    Category.deleteCategory(req.params.id);
    res.redirect("/admin/categories?message=Category deleted successfully!");
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.redirect("/admin/categories?error=Failed to delete category");
  }
});

module.exports = router;
