//src/config/database.js

// Load environment variables from .env file
require('dotenv').config();

// Create a MySQL connection pool using mysql2/promise
const mysql = require('mysql2/promise');

// Create a connection pool with the database configuration

// The connection pool allows for efficient management of multiple database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,    
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});



// Export the connection pool for use in other parts of the application
module.exports = pool;