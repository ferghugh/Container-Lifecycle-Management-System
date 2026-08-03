// src/server.js

// Load environment variables from .env file
require('dotenv').config();

// Import the Express application
const app = require('./app');

// Define the port to listen on, defaulting to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
