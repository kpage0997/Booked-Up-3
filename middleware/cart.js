// middleware/cart.js
module.exports = (req, res, next) => {
    // Ensure the cart exists in the session
    req.session.cart = req.session.cart || [];
    next(); // Pass control to the next middleware or route handler
};