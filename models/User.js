const Database = require('better-sqlite3');
const db = new Database('./database/bookedup3.db');

class User {
    static findByEmailAndPassword(email, password) {
        return db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password);
    }

    static findById(id) {
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }
}

module.exports = User;