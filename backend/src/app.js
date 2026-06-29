//src/appp.js

// Import the Express application
const express = require('express');

// Import the CORS middleware
const cors = require('cors');

// Create an instance of the Express application
const app = express();


//Middleware to enable CORS for all routes

app.use(cors()); 

// Middleware to parse incoming JSON requests
app.use(express.json());

// Import the authentication routes
const authRoutes = require("./routes/authRoutes");
const containerRoutes = require("./routes/containerRoutes");

// Use the authentication routes for any requests to /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/containers", containerRoutes);


//check route to verify that the server is running
app.get('/', (req, res) => {
    res.json({ message: " Container Lifecycle Management System API!",
        version: "1.0.0",
        status: "running"
     });
});

//404 error handler middleware
app.use((req, res, next) => {
    res.status(404).json({message: "Route not found" });
});

//main error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Export the Express application for use in other parts of the application
module.exports = app;   