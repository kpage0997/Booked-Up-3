/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing customer orders in the admin section of the BookedUp project.
 * It allows admin users to view, update, and manage all customer orders, providing 
 * tools for tracking and fulfilling orders efficiently.
 *
 */

const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../middleware/auth");
const User = require("../models/User"); // Import the User model
const Order = require("../models/Order"); // Import the Order model

// Admin - View all orders
router.get("/", requireAdmin, (req, res) => {
  try {
    const orders = Order.getAllOrders(); // Fetch all orders
    const message = req.query.message || null;
    const error = req.query.error || null;

    res.render("layout", {
      view: "admin-orders",
      orders,
      user: req.session.user,
      message,
      error,
    });
  } catch (error) {
    console.error("Error fetching order history:", error.message);
    res.redirect("/admin/orders?error=Failed to fetch order history.");
  }
});

// Admin - List all customers with orders
router.get("/customers", requireAdmin, (req, res) => {
  try {
    const customers = User.getAllUsersWithOrders(); // Fetch customers with orders
    const message = req.query.message || null;
    const error = req.query.error || null;

    res.render("layout", {
      view: "admin-customer-orders",
      customers,
      user: req.session.user,
      message,
      error,
    });
  } catch (error) {
    console.error("Error fetching customers with orders:", error.message);
    res.redirect(
      "/admin/orders/customers?error=Failed to fetch customers with orders."
    );
  }
});

// Admin - View specific customer's orders
router.get("/customers/:userId", requireAdmin, (req, res) => {
  try {
    const userId = req.params.userId;
    const customer = User.getUserById(userId); // Fetch customer details
    const orders = Order.getOrderHistory(userId); // Fetch their orders

    if (!customer) {
      return res.redirect("/admin/orders/customers?error=Customer not found.");
    }

    const message = req.query.message || null;
    const error = req.query.error || null;

    res.render("layout", {
      view: "admin-customer-orders-history",
      orders,
      customer,
      user: req.session.user,
      message,
      error,
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error.message);
    res.redirect(
      `/admin/orders/customers/${req.params.userId}?error=Failed to fetch customer orders.`
    );
  }
});

// Admin - View specific order details
router.get("/:id", requireAdmin, (req, res) => {
  try {
    const orderDetails = Order.getOrderDetails(req.params.id); // Fetch order details
    const message = req.query.message || null;
    const error = req.query.error || null;

    res.render("layout", {
      view: "order-detail",
      orderDetails,
      user: req.session.user,
      message,
      error,
    });
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res.redirect(
      `/admin/orders/${req.params.id}?error=Failed to fetch order details.`
    );
  }
});

module.exports = router;
