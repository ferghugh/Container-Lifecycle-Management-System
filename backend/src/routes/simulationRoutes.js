// src/routes/simulationRoutes.js

const express = require("express");

const router = express.Router();
// Import the simulation controller and authentication middleware
const simulationController = require("../controllers/simulationController");

const authMiddleware = require("../middleware/authMiddleware");
// Define the route for running a single simulation, protected by authentication middleware
router.post(
    "/run",
    authMiddleware,
    simulationController.runSimulation
);
router.post(
    "/run-many",
    authMiddleware,
    simulationController.runSimulationCycles
);

module.exports = router;