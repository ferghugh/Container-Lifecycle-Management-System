// src/server.js

// Load environment variables from .env file
require('dotenv').config();

// Import the Express application
const app = require('./app');


const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
