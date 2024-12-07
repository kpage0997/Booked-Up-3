/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing customer orders in the BookedUp project.
 * It allows users to view their order history and access order confirmation details.
 *
 */

const express = require("express");
const router = express.Router();
const db = require("../database/dbInit");
const Order = require("../models/Order");

// Middleware to ensure the user is logged in
function ensureLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

// Order History Route
router.get("/history", ensureLoggedIn, (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    req.session.error = "You must be logged in to view your order history.";
    return res.redirect("/auth/login");
  }

  try {
    const orders = Order.getOrderHistory(userId); // Fetch order history

    res.render("layout", {
      view: "history",
      orders,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching order history:", error.message);
    req.session.error = "Failed to load your order history.";
    res.redirect("/");
  }
});

router.get("/confirmation/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  try {
    const orderDetails = Order.getOrderDetails(orderId); // Fetch the details of the order

    console.log("Order Details Debug:", JSON.stringify(orderDetails, null, 2)); // Log the data for debugging

    res.render("layout", {
      view: "order-confirmation",
      orderDetails,
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error fetching order confirmation details:", error.message);
    req.session.error = "Failed to load the order confirmation page.";
    res.redirect("/orders/history");
  }
});

module.exports = router;
