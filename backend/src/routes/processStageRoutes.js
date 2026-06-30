//src/routes/processStageRoutes.js

// Import necessary modules
const express = require("express");
// Create a new router instance
const router = express.Router();
// Import the authentication middleware 
const authMiddleware = require("../middleware/authMiddleware");
////import the process stage controller
const processStageController = require("../controllers/processStageController");

// Define a route to retrieve all process stages, protected by authentication middleware
router.get("/", authMiddleware, processStageController.getAllProcessStages);

// Export the router for use in other parts of the application
module.exports = router;