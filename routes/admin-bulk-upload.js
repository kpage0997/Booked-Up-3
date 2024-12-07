/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for bulk uploading books in the admin section of the BookedUp project.
 * It allows admin users to upload multiple books at once via a file upload feature, streamlining 
 * the process of adding large volumes of book data to the database.
 *
 */

const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth"); // Ensure only admins can access
const upload = require("../middleware/multer"); // Import multer for file uploads
const fs = require("fs");
const Book = require("../models/Book");

// Render the Bulk Upload Form
router.get("/", requireAdmin, (req, res) => {
  res.render("layout", {
    view: "admin-bulk-upload",
    user: req.session.user,
    successMessage: req.session.successMessage || null,
    errorMessage: req.session.errorMessage || null,
  });

  // Clear messages after rendering
  req.session.successMessage = null;
  req.session.errorMessage = null;
});

// Handle Bulk Upload JSON File
router.post("/", requireAdmin, upload.single("jsonFile"), (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    req.session.errorMessage = "No file uploaded!";
    return res.redirect("/admin/bulk-upload");
  }

  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(jsonData)) {
      throw new Error("Invalid JSON format. Expected an array of products.");
    }

    jsonData.forEach((product) => {
      const { title, author, category, price, description, image_url } =
        product;
      Book.addBook({ title, author, category, price, description, image_url });
    });

    req.session.successMessage = "Products uploaded successfully!";
  } catch (error) {
    console.error("Error processing bulk upload:", error.message);
    req.session.errorMessage =
      "Failed to upload products. Ensure the JSON file format is correct.";
  } finally {
    if (filePath) {
      fs.unlinkSync(filePath); // Remove the uploaded file
    }
    res.redirect("/admin/bulk-upload");
  }
});
module.exports = router;
