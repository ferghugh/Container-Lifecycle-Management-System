// src/services/productionService.js

const containerModel = require("../models/containerModel");
const movementModel = require("../models/movementModel");

const approvalService = require("./approvalService");

const { STAGES } = require("../constants/stageRules");
const LOCATIONS = require("../constants/locations");



// ------------------------------------------------
// Simulation User
// ------------------------------------------------

const simulationUser = {
  id: 4,
  username: "simulation",
  role: "USER"
};

// ------------------------------------------------
// Run Production Batch
// ------------------------------------------------

async function runProductionBatch(containerId) {

  const container =
    await containerModel.getContainerById(containerId);

  if (!container) {
    throw new Error("Container not found.");
  }

  if (container.current_status !== STAGES.PRODUCTION) {
    throw new Error("Container is not in Production.");
  }

  const newUseCount =
    (container.use_count ?? 0) + 1;

  const timeExpired =
    container.last_cycle_start_at &&
    (
      new Date(container.last_cycle_start_at).getTime() +
      (30 * 24 * 60 * 60 * 1000)
    ) < Date.now();

  // ------------------------------------------------
  // Lifecycle Expiry
  // ------------------------------------------------

  if (newUseCount > 14 || timeExpired) {

    // Move container to Cleaning
    await containerModel.updateContainerWorkflow(
      container.id,
      {
        current_status: STAGES.CLEANING,
        location_id: LOCATIONS.CLEANING,

      
        requires_qa_approval: container.requires_qa_approval,
    

        use_count: 14,
        last_cycle_start_at: container.last_cycle_start_at,
        initial_qa_approved_at: container.initial_qa_approved_at
      }
    );

    // Record workflow movement
    await movementModel.createMovement({

      container_id: container.id,

      from_stage: STAGES.PRODUCTION,
      to_stage: STAGES.CLEANING,

      moved_by_user_id: simulationUser.id,
      approved_by_user_id: null

    });

    // Create Supervisor approval request
    await approvalService.createApproval(
      container,
      STAGES.PRODUCTION,
      STAGES.CLEANING,
      simulationUser
    );

    return {

      message:
        "Container lifecycle expired. Container moved to CLEANING awaiting Supervisor approval."

    };

  }

  // ------------------------------------------------
  // Normal Production Batch
  // ------------------------------------------------

  const lastCycleStartAt =
    container.last_cycle_start_at ?? new Date();

  const updated =
    await containerModel.updateProductionUse(
      container.id,
      newUseCount,
      lastCycleStartAt
    );

  if (!updated) {
    throw new Error("Failed to update production use.");
  }

  // Reload updated container
  const updatedContainer =
    await containerModel.getContainerById(container.id);

  // Simulate a possible observation
  const observation =
    await simulateObservation(updatedContainer);

  return {

    message: "Production batch completed successfully.",

    container: updatedContainer,

    observation

  };

}

module.exports = {
  runProductionBatch
};