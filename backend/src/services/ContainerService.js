// src/services/ContainerService.js

const containerModel = require("../models/containerModel");
const LOCATIONS = require("../constants/locations");
const { STAGES } = require("../constants/stageRules");
const stageRules = require("../constants/stageRules");
const movementModel = require("../models/movementModel");
const approvalService = require("../services/approvalService");

// Retrieve all containers
async function getAllContainers() {
  return await containerModel.getAllContainers();
}

// Retrieve a container by ID
async function getContainerById(id) {
  const container = await containerModel.getContainerById(id);
  // If the container is not found, throw an error
  if (!container) {
    throw new Error("Container not found");
  }
  // Return the container if found
  return container;
}

// Create a new container
async function createContainer(containerData) {
  const { container_code } = containerData;

  //validation
  if (!container_code || container_code.trim() === "") {
    throw new Error("Container code is required");
  }
  //check if container code already exists
  const existing = await containerModel.getContainerByCode(container_code);
  if (existing) {
    // If the container code already exists, throw an error
    throw new Error("Container code already exists");
  }
  //set default lifecycle values
  containerData.current_status = STAGES.RECEIVED;
  containerData.location_id = LOCATIONS.RECEIVING; // Set the default location to "Receiving"
  containerData.is_damaged = false;
  containerData.requires_qa_approval = true;
  containerData.requires_swab = false;
  containerData.last_cycle_start_at = null;
  containerData.initial_qa_approved_at = null;
  // Call the model function to create the container in the database
  return await containerModel.createContainer(containerData);
}

// Update an existing container
async function updateContainer(id, containerData) {
  const container = await containerModel.getContainerById(id);
  // If the container is not found, throw an error
  if (!container) {
    throw new Error("Container not found");
  }

 

  //Dont allow lifecycle stage to be updated directly through this service.
  // Lifecycle stage should be updated through the process stage service
  const updateData = {
    container_code: containerData.container_code,
  };
  // Call the model function to update the container in the database
  return await containerModel.updateContainer(id, updateData);
}
// Move a container through the lifecycle stages
async function moveContainer(id, movementData, user) {

  // Retrieve the container
  const container = await containerModel.getContainerById(id);

  if (!container) {
    throw new Error("Container not found");
  }

  // Requested destination stage
  const { nextStage } = movementData;

  if (!nextStage) {
    throw new Error("Next stage is required");
  }

  // Current stage
  const previousStage = container.current_status;

  // Prevent moving to the same stage
  if (previousStage === nextStage) {
    throw new Error("Container is already in this stage.");
  }

  // Validate the workflow
  if (!stageRules.isValidTransition(previousStage, nextStage)) {
    throw new Error(
      `Invalid stage transition from ${previousStage} to ${nextStage}`
    );
  }

  // ------------------------------------
  // APPROVAL WORKFLOW
  // ------------------------------------

  let approval = null;

  if (stageRules.requiresApproval(previousStage, nextStage)) {

    approval = await approvalService.getLatestApproval(
      container.id,
      previousStage,
      nextStage
    );

    // No approval exists
    if (!approval) {

      await approvalService.createApproval(
        container,
        previousStage,
        nextStage,
        user
      );

      return {
        message: "Approval required. Request created."
      };
    }

    // Approval still waiting
    if (approval.status === "PENDING") {
      throw new Error("Approval is still pending.");
    }

    // Approval rejected
    if (approval.status === "REJECTED") {
      throw new Error("Approval was rejected.");
    }

    // If APPROVED, continue with the move
  }


  // RECORD MOVEMENT


  await movementModel.createMovement({

    container_id: container.id,

    from_stage: previousStage,

    to_stage: nextStage,

    moved_by_user_id: user.id,

    approved_by_user_id: approval
      ? approval.reviewed_by_user_id
      : null,

  });

  // ------------------------------------
  // UPDATE CONTAINER
  // ------------------------------------

  const workflowUpdate = {

    current_status: nextStage,

    location_id: getLocationForStage(nextStage),

    is_damaged: container.is_damaged,

    requires_qa_approval: container.requires_qa_approval,

    requires_swab: container.requires_swab,

    last_cycle_start_at: container.last_cycle_start_at,

    initial_qa_approved_at: container.initial_qa_approved_at,
  };
  
if (nextStage === STAGES.PRODUCTION) {

    workflowUpdate.last_cycle_start_at = new Date();

    workflowUpdate.requires_qa_approval = false;

    if (!container.initial_qa_approved_at) {
        workflowUpdate.initial_qa_approved_at = new Date();
    }
}
 

  await containerModel.updateContainerWorkflow(
    id,
    workflowUpdate
  );

  // Retrieve the updated container
  const updatedContainer =
    await containerModel.getContainerById(id);

  return {
    message: `Container moved from stage ${previousStage} to ${nextStage}.`,
    container: updatedContainer,
    user,
  };
}
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