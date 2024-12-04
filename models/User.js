const Database = require('better-sqlite3');
const db = new Database('./database/bookedup3.db');

class User {
    static findByEmailAndPassword(email, password) {
        return db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    }

    static getAllUsersWithOrders() {
        return db.prepare(`
            SELECT DISTINCT u.id, u.username
            FROM users u
            JOIN orders o ON u.id = o.user_id
        `).all();
    }

    static getUserById(userId) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    }
}

module.exports = User;