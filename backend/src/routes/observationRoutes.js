// src/routes/observationRoutes.js

const express = require("express");
const router = express.Router();

const observationController = require("../controllers/observationController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

// ------------------------------------
// CREATE OBSERVATION
// Any authenticated user can raise one
// ------------------------------------
router.post(
  "/",
  authMiddleware,
  observationController.createObservation
);

// ------------------------------------
// GET ALL OBSERVATIONS
// ------------------------------------
router.get(
  "/",
  authMiddleware,
  observationController.getAllObservations
);

// ------------------------------------
// RESOLVE OBSERVATION
// QA only
// ------------------------------------
router.put(
  "/:id/resolve",
  authMiddleware,
  authorizationMiddleware("QA"),
  observationController.resolveObservation
);

module.exports = router;