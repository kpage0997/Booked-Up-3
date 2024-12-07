/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the routes for managing the shopping cart in the BookedUp project.
 * It allows users to view, add, update, and remove items in their cart, as well as proceed 
 * to checkout and place orders.
 *
 */

const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Book = require("../models/Book");
const ensureCart = require("../middleware/cart");

// Apply middleware to initialize the cart
router.use(ensureCart);

// Display cart
router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  const validCart = cart.filter((item) => item.title && item.price > 0); // Validate cart items

  // Update session with valid cart
  req.session.cart = validCart;

  res.render("layout", {
    view: "cart",
    cart: validCart,
    user: req.session.user || null,
  });
});

// Add item to cart
router.post("/add", (req, res) => {
  const { id, key, title, author, price } = req.body;

  // Debug incoming data
  console.log("Incoming book data:", { id, key, title, author, price });

  // Ensure session cart is initialized
  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Handle missing identifier
  if (!id && !key) {
    console.error("Missing book identifier:", {
      id,
      key,
      title,
      author,
      price,
    });
    req.session.error = `Unable to add "${title}". Invalid book data.`;
    return res.redirect("/cart");
  }

  // Database book logic
  if (id && !key) {
    const book = Book.getBookById(id); // Fetch book from the database
    if (!book) {
      console.error("Book not found in the database:", id);
      req.session.error = "Book not found.";
      return res.redirect("/cart");
    }

    const existingItem = req.session.cart.find((item) => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
      req.session.message = `"${book.title}" quantity updated in your cart!`;
    } else {
      req.session.cart.push({
        id: book.id,
        title: book.title,
        author: book.author || "Unknown",
        price: parseFloat(book.price),
        quantity: 1,
      });
      req.session.message = `"${book.title}" added to your cart!`;
    }
    return res.redirect("/cart");
  }

  // API book logic
  if (key) {
    const existingItem = req.session.cart.find((item) => item.key === key);
    if (existingItem) {
      existingItem.quantity += 1;
      req.session.message = `"${title}" quantity updated in your cart!`;
    } else {
      req.session.cart.push({
        id: id || null,
        key: key || null,
        title,
        author: author || "Unknown",
        price: parseFloat(price) > 0 ? parseFloat(price) : 9.99, // Default to $9.99
        quantity: 1,
      });
      req.session.message = `"${title}" added to your cart!`;
    }
    return res.redirect("/cart");
  }
});

// Confirm Checkout
router.post("/checkout", async (req, res) => {
  const userId = req.session.user?.id;
  const cart = req.session.cart || [];

  // Check if the user is logged in
  if (!userId) {
    req.session.error = "You must be logged in to place an order.";
    return res.redirect("/auth/login");
  }

  // Check if the cart is empty
  if (cart.length === 0) {
    req.session.error = "Your cart is empty.";
    return res.redirect("/cart");
  }

  try {
    // Place the order using the Order model
    const orderId = Order.placeOrder(userId, cart);

    // Clear the cart after a successful order
    req.session.cart = [];

    // Redirect to the confirmation page with the order ID
    req.session.message = `Order placed successfully! Your order ID is ${orderId}.`;
    res.redirect(`/orders/confirmation/${orderId}`);
  } catch (error) {
    console.error("Error processing order:", error.message);

    // Handle any errors that occur during the checkout process
    req.session.error = "An error occurred while placing the order.";
    res.redirect("/cart");
  }
});
// Checkout page
router.get("/checkout", (req, res) => {
  const cart = req.session.cart;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render("layout", {
    view: "checkout",
    cart,
    total,
    user: req.session.user || null,
  });
});

//update quantity
// Update item quantity in cart
router.post("/update/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  const { quantity } = req.body;

  if (req.session.cart && req.session.cart[index]) {
    const item = req.session.cart[index];

    // Update the quantity
    item.quantity = parseInt(quantity, 10) || 1;

    req.session.message = `"${item.title}" quantity updated to ${item.quantity}!`;
    res.redirect("/cart");
  } else {
    req.session.error = "Item not found in cart.";
    res.redirect("/cart");
  }
});
// Remove item from cart
router.post("/remove/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (req.session.cart && req.session.cart[index]) {
    req.session.cart.splice(index, 1); // Remove the item at the given index
    res.locals.message = "Item removed from cart.";
  } else {
    res.locals.error = "Item not found in cart.";
  }
  res.redirect("/cart");
});
module.exports = router;
