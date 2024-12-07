/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing customer-specific functionality in the BookedUp project.
 * It provides access to the customer dashboard, where users can view their order history 
 * and manage their current shopping cart.
 *
 */

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Customer Dashboard
router.get("/dashboard", (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    req.session.error = "You must be logged in to view your dashboard.";
    return res.redirect("/auth/login");
  }

  try {
    const orderHistory = Order.getOrderHistory(userId); // Fetch the customer's orders
    const cart = req.session.cart || []; // Fetch the current cart

    res.render("layout", {
      view: "customer-dashboard",
      user: req.session.user,
      orderHistory,
      cart,
    });
  } catch (error) {
    console.error("Error loading customer dashboard:", error.message);
    req.session.error = "An error occurred while loading your dashboard.";
    res.redirect("/auth/login");
  }
});

module.exports = router;
