const Database = require('better-sqlite3');
const db = new Database('./database/bookedup3.db');

class Order {
    // Create a new order
    static createOrder(userId, total) {
        return db
            .prepare('INSERT INTO orders (user_id, total, created_at) VALUES (?, ?, ?)')
            .run(userId, total, new Date().toISOString()).lastInsertRowid;
    }

    // Add an item to an order
    static addOrderItem(orderId, bookId, quantity, price) {
        db.prepare('INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)')
            .run(orderId, bookId, quantity, price);
    }

    //Get order history for a specific user
    static getOrderHistory(userId) {
        return db.prepare(`
            SELECT 
                o.id AS order_id, 
                o.total, -- Include the total field
                o.created_at, 
                b.title, 
                oi.quantity, 
                oi.price
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN books b ON oi.book_id = b.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `).all(userId);
    }

    // Fetch all orders (for admin)
    static getAllOrders() {
        return db.prepare(`
            SELECT 
                o.id AS order_id,
                u.username AS customer_name,
                o.total,
                o.created_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `).all();
    }

    // Get details of a specific order (for admin or customer)
    static getOrderDetails(orderId) {
        return db.prepare(`
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
        `).all(orderId);
    }

    // Place an order
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
            // Calculate total order cost
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
            // Insert the order and get its ID
            const result = insertOrder.run(userId, total, new Date().toISOString());
            const orderId = result.lastInsertRowid;
    
            // Insert items for the order
            cart.forEach(item => {
                insertOrderItem.run(orderId, item.id, item.quantity, item.price);
            });
    
            return orderId;
        });
    
        return transaction(userId, cart);
    }
}

module.exports = Order;