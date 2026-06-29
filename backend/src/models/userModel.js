//src/models/userModel.js
const db = require("../config/database");

// UserModel to interact with the users table in the database
const userModel = {

  // Find a user by their username in the database
  async findByUsername(username) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    return rows[0] || null;
  },

// Create a new user in the database with a username, password hash, and role
  async createUser(username, passwordHash, role = "USER") {
    const [result] = await db.query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
      [username, passwordHash, role]
    );

    return result;
  },
// Update the last login timestamp for a user in the database
  async updateLastLogin(userId) {
    const [result] = await db.query(
      "UPDATE users SET last_login = NOW() WHERE id = ?",
      [userId]
    );
    

    return result;
  }

};
// Export the userModel for use in other parts of the application
module.exports = userModel;