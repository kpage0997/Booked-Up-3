/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This middleware ensures that the shopping cart exists in the user's session.
 * It initializes an empty cart if none exists, allowing subsequent cart operations 
 * to function without errors.
 *
 */

// middleware/cart.js
module.exports = (req, res, next) => {
  // Ensure the cart exists in the session
  req.session.cart = req.session.cart || [];
  next(); // Pass control to the next middleware or route handler
};
