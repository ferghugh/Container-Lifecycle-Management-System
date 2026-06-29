//src/config/database.js

// Load environment variables from .env file
require('dotenv').config();

// Create a MySQL connection pool using mysql2/promise
const mysql = require('mysql2/promise');

// Create a connection pool with the database configuration


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,    
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//test the connection to the database
async function connectDatabase() {
    try{
        const connection = await pool.getConnection();
        console.log("Connected to mySQL database");
        

        connection.release();
    } catch (error) {
        console.error("Database connection failed");
        console.error(error.message);
    }
}
connectDatabase();

// Export the connection pool for use in other parts of the application
module.exports = pool;