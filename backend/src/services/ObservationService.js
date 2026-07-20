// src/services/observationService.js

const observationModel = require("../models/observationModel");
const containerService = require("./containerService");
const { STAGES } = require("../constants/stageRules");

// ------------------------------------
// CREATE OBSERVATION
// ------------------------------------
async function createObservation(observationData, user) {

  const observationId =
    await observationModel.createObservation({
      container_id: observationData.container_id,
      observed_by_user_id: user.id,
      description: observationData.description,
      is_breach: observationData.is_breach
    });

  // ------------------------------------
  // BREACH WORKFLOW
  // ------------------------------------
  if (observationData.is_breach) {

await containerService.moveContainer(
  observationData.container_id,
  {
    nextStage: STAGES.CLEANING,
    bypassApproval: true
  },
  user
);
  }

  return observationId;
}

// ------------------------------------
// GET OBSERVATIONS
// ------------------------------------
async function getAllObservations(status) {
  return await observationModel.getAllObservations(status);
}

// ------------------------------------
// RESOLVE OBSERVATION
// ------------------------------------
async function resolveObservation(id, user) {

  const resolved = await observationModel.resolveObservation(id, user.id);

  if (!resolved) {
    throw new Error("Observation not found or already resolved.");
  }

  return {
    message: "Observation resolved."
  };

}

module.exports = {
  createObservation,
  getAllObservations,
  resolveObservation
};