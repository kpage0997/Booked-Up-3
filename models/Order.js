/**
 * Name: Kennedy Page
 * Date: 12.07.24
 * CSC 372-01
 *
 * This file defines the Order class, which manages database operations related 
 * to orders in the BookedUp project. It provides methods for creating, retrieving, 
 * and managing orders, as well as tracking user order history.
 *
 */

const db = require("../database/dbInit");

class Order {
  // Create a new order and return the inserted order ID
  static createOrder(userId, total) {
    try {
      const result = db
        .prepare(
          "INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)"
        )
        .run(userId, total, new Date().toISOString());
      return result.lastInsertRowid; // Return the ID of the new order
    } catch (error) {
      console.error("Error creating order:", error.message);
      throw new Error("Failed to create order.");
    }
  }

  // Place an order with items
  static placeOrder(userId, cart) {
    const insertOrder = db.prepare(`
    INSERT INTO orders (user_id, total, created_at)
    VALUES (?, ?, ?)
  `);

    const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, book_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);

    const transaction = db.transaction((userId, cart) => {
      const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const result = insertOrder.run(userId, total, new Date().toISOString());
      const orderId = result.lastInsertRowid;

      cart.forEach((item) => {
        if (item.id) {
          // Database book
          insertOrderItem.run(orderId, item.id, item.quantity, item.price);
        } else if (item.key) {
          // API book
          insertOrderItem.run(orderId, null, item.quantity, item.price); // Use null for book_id
        } else {
          throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
        }
      });

      return orderId;
    });

    return transaction(userId, cart);
  }

  // Get details of a specific order
  static getOrderDetails(orderId) {
    try {
      // Fetch the order summary
      const order = db
        .prepare(
          `
        SELECT 
          o.id AS order_id,
          o.total,
          o.created_at,
          u.username AS customer_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `
        )
        .get(orderId);

      if (!order) {
        console.error("Order not found for ID:", orderId);
        throw new Error("Order not found.");
      }

      // Fetch the order items
      const items = db
        .prepare(
          `
        SELECT 
          b.title AS book_title,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = ?
      `
        )
        .all(orderId);

      // Calculate the total (if needed)
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Combine the order and items
      return { ...order, items, total };
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      throw new Error("Failed to fetch order details.");
    }
  }
  // Get order history for a specific user
  static getOrderHistory(userId) {
    try {
      console.log("Fetching order history for user:", userId);

      return db
        .prepare(
          `
          SELECT 
            o.id AS order_id, 
            o.total, 
            o.created_at, 
            b.title, 
            oi.quantity, 
            oi.price
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN books b ON oi.book_id = b.id
          WHERE o.user_id = ?
          ORDER BY o.created_at DESC
        `
        )
        .all(userId);
    } catch (error) {
      console.error("Error fetching order history:", error.message);
      throw new Error("Failed to fetch order history.");
    }
  }

  // Fetch all orders (for admin)
  static getAllOrders() {
    try {
      console.log("Fetching all orders for admin");

      return db
        .prepare(
          `
          SELECT 
            o.id AS order_id,
            u.username AS customer_name,
            o.total,
            o.created_at
          FROM orders o
          JOIN users u ON o.user_id = u.id
          ORDER BY o.created_at DESC
        `
        )
        .all();
    } catch (error) {
      console.error("Error fetching all orders:", error.message);
      throw new Error("Failed to fetch all orders.");
    }
  }

  // Get detailed information of a specific order (for admin or customer)
  static getDetailedOrder(orderId) {
    try {
      console.log("Fetching detailed information for Order ID:", orderId);

      return db
        .prepare(
          `
          SELECT 
            o.id AS order_id,
            u.username AS customer_name,
            b.title,
            oi.quantity,
            oi.price,
            o.total,
            o.created_at
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN books b ON oi.book_id = b.id
          JOIN users u ON o.user_id = u.id
          WHERE o.id = ?
        `
        )
        .all(orderId);
    } catch (error) {
      console.error("Error fetching detailed order:", error.message);
      throw new Error("Failed to fetch detailed order.");
    }
  }
}

module.exports = Order;
