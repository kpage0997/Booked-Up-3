/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This controller manages all operations related to orders in the BookedUp project.
 * It provides methods for handling user actions such as placing orders, viewing 
 * order history, and managing the shopping cart.
 * 
 */

const Order = require("../models/Order");

exports.getOrderHistory = (req, res) => {
  const userId = req.session.user.id;
  const orders = Order.getOrderHistory(userId);
  res.render("layout", { view: "history", orders, user: req.session.user });
};

exports.placeOrder = (req, res) => {
  const userId = req.session.user.id;
  const cart = req.session.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderId = Order.createOrder(userId, total);
  cart.forEach((item) => {
    Order.addOrderItem(orderId, item.id, item.quantity, item.price);
  });

  req.session.cart = []; // Clear the cart
  req.session.message = "Order placed successfully!";
  res.redirect("/orders/history");
};
