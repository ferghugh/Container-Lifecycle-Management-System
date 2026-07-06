// src/routes/simulationRoutes.js

const express = require("express");

const router = express.Router();

const simulationController =
    require("../controllers/simulationController");

const authMiddleware =
    require("../middleware/authMiddleware");

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