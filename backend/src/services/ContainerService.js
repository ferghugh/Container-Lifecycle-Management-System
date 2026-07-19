// src/services/ContainerService.js

const containerModel = require("../models/containerModel");
const LOCATIONS = require("../constants/locations");
const { STAGES } = require("../constants/stageRules");
const stageRules = require("../constants/stageRules");
const movementModel = require("../models/movementModel");
const approvalService = require("./approvalService");

// ------------------------------------
// GET ALL CONTAINERS
// ------------------------------------
async function getAllContainers() {
  return await containerModel.getAllContainers();
}

// ------------------------------------
// GET CONTAINER BY ID
// ------------------------------------
async function getContainerById(id) {
  const container = await containerModel.getContainerById(id);
  if (!container) throw new Error("Container not found");
  return container;
}

// ------------------------------------
// CREATE CONTAINER
// ------------------------------------
async function createContainer(containerData) {
  const { container_code } = containerData;

  if (!container_code || container_code.trim() === "") {
    throw new Error("Container code is required");
  }

  const existing = await containerModel.getContainerByCode(container_code);
  if (existing) throw new Error("Container code already exists");

  containerData.current_status = STAGES.RECEIVED;
  containerData.location_id = LOCATIONS.RECEIVING;
  containerData.is_damaged = false;
  containerData.requires_qa_approval = true;
  containerData.requires_swab = false;
  containerData.last_cycle_start_at = null;
  containerData.initial_qa_approved_at = null;

  return await containerModel.createContainer(containerData);
}

// ------------------------------------
// UPDATE CONTAINER (NO LIFECYCLE CHANGES)
// ------------------------------------
async function updateContainer(id, containerData) {
  const container = await containerModel.getContainerById(id);
  if (!container) throw new Error("Container not found");

  const updateData = {
    container_code: containerData.container_code,
  };

  return await containerModel.updateContainer(id, updateData);
}

// ------------------------------------
// MOVE CONTAINER THROUGH LIFECYCLE
// ------------------------------------
async function moveContainer(id, movementData, user) {
  const container = await containerModel.getContainerById(id);
  if (!container) throw new Error("Container not found");

  const { nextStage, bypassApproval = false } = movementData;
  if (!nextStage) throw new Error("Next stage is required");

  const previousStage = container.current_status;

  if (previousStage === nextStage) {
    throw new Error("Container is already in this stage.");
  }

  if (!stageRules.isValidTransition(previousStage, nextStage)) {
    throw new Error(
      `Invalid stage transition from ${previousStage} to ${nextStage}`,
    );
  }

  // ------------------------------------
  // APPROVAL WORKFLOW
  // ------------------------------------
  let approval = null;

  if (
    !bypassApproval &&
    stageRules.requiresApproval(previousStage, nextStage)
  ) {
    approval = await approvalService.getLatestApproval(
      container.id,
      previousStage,
      nextStage,
    );

    if (!approval) {
      approval = await approvalService.createApproval(
        container,
        previousStage,
        nextStage,
        user,
      );

      return {
        message: "Approval required. Request created.",
        approval,
      };
    }

    if (approval.status === "PENDING") {
      throw new Error("Approval is still pending.");
    }

    if (approval.status === "REJECTED") {
      throw new Error("Approval was rejected.");
    }
  }

  // ------------------------------------
  // UPDATE CONTAINER WORKFLOW
  // ------------------------------------
  const workflowUpdate = {
    current_status: nextStage,
    location_id: getLocationForStage(nextStage),
    is_damaged: container.is_damaged,
    requires_qa_approval: container.requires_qa_approval,
    requires_swab: container.requires_swab,
    last_cycle_start_at: container.last_cycle_start_at,
    use_count: container.use_count,
    initial_qa_approved_at: container.initial_qa_approved_at,
  };

  // ------------------------------------
  // FIRST-TIME QA APPROVAL LIFECYCLE UPDATE
  // ------------------------------------

  // Production and expired containers have special lifecycle rules
  if (nextStage === STAGES.PRODUCTION) {
    // First production entry completes the initial QA requirement
    if (container.requires_qa_approval) {
      workflowUpdate.requires_qa_approval = false;
      workflowUpdate.initial_qa_approved_at = new Date();
    }

    const newUseCount = (container.use_count ?? 0) + 1;

    let timeExpired = false;

    if (container.last_cycle_start_at) {
      const expiryDate = new Date(container.last_cycle_start_at);

      // Valid for the whole of the 30th day
      expiryDate.setDate(expiryDate.getDate() + 31);

      // Expires at midnight
      expiryDate.setHours(0, 0, 0, 0);

      timeExpired = new Date() >= expiryDate;
    }

    // Update lifecycle values
    workflowUpdate.use_count = newUseCount;

    // Start the lifecycle timer only once
    if (!container.last_cycle_start_at) {
      workflowUpdate.last_cycle_start_at = new Date();
    }

    // ------------------------------------
    // LIFECYCLE EXPIRED
    // ------------------------------------
    if (newUseCount > 14 || timeExpired) {
      workflowUpdate.current_status = STAGES.CLEANING;
      workflowUpdate.location_id = getLocationForStage(STAGES.CLEANING);

      // Preserve the lifecycle usage count.
      //
      // If the container expires because it exceeded 14 production uses,
      // record the completed lifecycle at 14 uses.
      //
      // If the container expires because the 30-day limit was reached,
      // preserve the actual number of production uses completed.
      workflowUpdate.use_count = newUseCount > 14 ? 14 : container.use_count;

      workflowUpdate.use_count = newUseCount > 14 ? 14 : container.use_count;

      await containerModel.updateContainerWorkflow(id, workflowUpdate);

      await movementModel.createMovement({
        container_id: container.id,
        from_stage: previousStage,
        to_stage: STAGES.CLEANING,
        moved_by_user_id: user.id,
        approved_by_user_id: null,
      });

      try {
        await approvalService.createApproval(
          container,
          STAGES.PRODUCTION,
          STAGES.CLEANING,
          user,
        );
      } catch (err) {
        // Ignore duplicate pending approval
        if (
          err.message ===
          "A pending approval already exists for this container."
        ) {
          return {
            message:
              "Container is already in CLEANING awaiting Supervisor approval.",
          };
        }

        throw err;
      }

      return {
        message:
          "Container lifecycle expired. Container moved to CLEANING awaiting Supervisor approval.",
      };
    }
  }
  // ------------------------------------
  // RECORD MOVEMENT
  // ------------------------------------
  await movementModel.createMovement({
    container_id: container.id,
    from_stage: previousStage,
    to_stage: nextStage,
    moved_by_user_id: user.id,
    approved_by_user_id: approval ? approval.reviewed_by_user_id : null,
  });

  await containerModel.updateContainerWorkflow(id, workflowUpdate);

  const updatedContainer = await containerModel.getContainerById(id);

  return {
    message: `Container moved from stage ${previousStage} to ${nextStage}.`,
    container: updatedContainer,
    user,
  };
}

// ------------------------------------
// LOCATION MAPPING
// ------------------------------------
function getLocationForStage(stage) {
  switch (stage) {
    case STAGES.RECEIVED:
      return LOCATIONS.RECEIVING;
    case STAGES.CLEANING:
      return LOCATIONS.CLEANING;
    case STAGES.CLEAN_STORAGE:
      return LOCATIONS.CLEAN_STORAGE;
    case STAGES.PRODUCTION:
      return LOCATIONS.PRODUCTION;
    default:
      throw new Error("Unknown stage");
  }
}

module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainer,
  moveContainer,
};
