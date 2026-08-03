const express = require("express");
const router = express.Router();
// Import the authentication middleware and dashboard controller
const authMiddleware = require("../middleware/authMiddleware");

const dashboardController = require("../controllers/dashboardController");

// Define the route for fetching analytics data, protected by authentication middleware
router.get(
    "/analytics",
    authMiddleware,
    dashboardController.getAnalytics
);

router.get(
    "/",
    authMiddleware,
    dashboardController.getDashboard
);


module.exports = router;