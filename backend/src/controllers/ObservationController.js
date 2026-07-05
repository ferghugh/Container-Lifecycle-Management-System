// src/controllers/observationController.js

const observationService = require("../services/observationService");

// ------------------------------------
// CREATE OBSERVATION
// ------------------------------------
async function createObservation(req, res) {

  try {

    const result = await observationService.createObservation(
      req.body,
      req.user
    );

    res.status(201).json(result);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

}

// ------------------------------------
// GET ALL OBSERVATIONS
// ------------------------------------
async function getAllObservations(req, res) {

  try {

    const observations =
      await observationService.getAllObservations(req.query.status);

    res.json(observations);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

}

// ------------------------------------
// RESOLVE OBSERVATION
// ------------------------------------
async function resolveObservation(req, res) {

  try {

    const result =
      await observationService.resolveObservation(
        req.params.id,
        req.user
      );

    res.json(result);

  } catch (err) {

    res.status(400).json({
      message: err.message
    });

  }

}

module.exports = {
  createObservation,
  getAllObservations,
  resolveObservation
};