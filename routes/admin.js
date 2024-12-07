/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the main router for the admin section of the BookedUp project.
 * It provides access to the admin dashboard and delegates routes for managing 
 * books, categories, orders, and bulk uploads.
 *
 */

const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");

// Admin dashboard
router.get("/", requireAdmin, (req, res) => {
  res.render("layout", { view: "admin-dashboard", user: req.session.user });
});

// Delegate books and categories routes
router.use("/books", require("./admin-books")); // Book management routes
router.use("/categories", require("./admin-categories")); // Category management routes
router.use("/orders", require("./admin-orders")); // Add orders route
router.use("/bulk-upload", require("./admin-bulk-upload"));

module.exports = router;
