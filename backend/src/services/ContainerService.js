// src/services/ContainerService.js

const containerModel = require("../models/containerModel");
const LOCATIONS = require("../constants/locations");
const { STAGES } = require("../constants/stageRules");
const stageRules = require("../constants/stageRules");
const movementModel = require("../models/movementModel");
const approvalService = require("./approvalService");


// get all containers
async function getAllContainers() {
  return await containerModel.getAllContainers();
}

// get container by id
async function getContainerById(id) {
  const container = await containerModel.getContainerById(id);
  if (!container) throw new Error("Container not found");
  return container;
}

// create a container
async function createContainer(containerData) {
  const { container_code } = containerData;
// Validate that the container code is provided and not empty
  if (!container_code || container_code.trim() === "") {
    throw new Error("Container code is required");
  }

 // Check if the container code already exists
  const existing = await containerModel.getContainerByCode(container_code);
  if (existing) throw new Error("Container code already exists");

  containerData.current_status = STAGES.RECEIVED;
  containerData.location_id = LOCATIONS.RECEIVING;
  containerData.requires_qa_approval = true;
  containerData.last_cycle_start_at = null;
  containerData.initial_qa_approved_at = null;

// create the container in the database
  return await containerModel.createContainer(containerData);
}

// update the container
async function updateContainer(id, containerData) {
  // Retrieve the container by its ID
  const container = await containerModel.getContainerById(id);
  // If the container does not exist, throw an error
  if (!container) throw new Error("Container not found");
// Validate that the container code is provided and not empty
  const updateData = {
    container_code: containerData.container_code,
  };
// Check if the container code already exists for a different container
  return await containerModel.updateContainer(id, updateData);
 
}
// main workflow engine for validating the container movements
// enforceing lifecycle rules, and managing approval requirements
async function moveContainer(id, movementData, user) {
  // Retrieve the container by its ID
  const container = await containerModel.getContainerById(id);
  // If the container does not exist, throw an error
  if (!container) throw new Error("Container not found");
// Extract the next stage and bypass approval flag from the movement data
  const { nextStage, bypassApproval = false } = movementData;
  // Validate that the next stage is provided
  if (!nextStage) throw new Error("Next stage is required");
// Determine the current stage of the container
  const previousStage = container.current_status;
   // If the previous stage is the same as the next stage, throw an error
  if (previousStage === nextStage) {
    throw new Error("Container is already in this stage.");
  }
  // ensure the requested lifecycle is valid
  if (!stageRules.isValidTransition(previousStage, nextStage)) {
    throw new Error(
      `Invalid stage transition from ${previousStage} to ${nextStage}`,
    );
  }

  // approval workflow
  // Check if approval is required for the transition from the previous stage to the next stage
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
 // If no approval exists, create a new approval request
    if (!approval) {
      //create a new approval request if one doesn't exist
      approval = await approvalService.createApproval(
        container,
        previousStage,
        nextStage,
        user,
      );

      return {
        message: `${approval.required_role} approval required. Request created.`,
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
  // update container workflow
  const workflowUpdate = {
    current_status: nextStage,
    location_id: getLocationForStage(nextStage),
    requires_qa_approval: container.requires_qa_approval,
    requires_supervisor_reset: container.requires_supervisor_reset,
    last_cycle_start_at: container.last_cycle_start_at,
    use_count: container.use_count,
    initial_qa_approved_at: container.initial_qa_approved_at,
  };


  // first time qa approve a container
  // production and expired containers have special lifecycle rules
  if (nextStage === STAGES.PRODUCTION) {
   
    // First production entry completes the initial QA requirement
    if (container.requires_qa_approval) {
      // Mark the container as no longer requiring QA approval
      workflowUpdate.requires_qa_approval = false;
      // Record the initial QA approval timestamp
      workflowUpdate.initial_qa_approved_at = new Date();
    }
    // increment the production use count for the current lifecycle
    const newUseCount = (container.use_count ?? 0) + 1;
    // Check if the container's lifecycle has expired due to usage or time
    let timeExpired = false;
    // Check if the container's lifecycle has expired due to time
    if (container.last_cycle_start_at) {
      // Calculate the expiry date by adding 31 days to the last cycle start date
      const expiryDate = new Date(container.last_cycle_start_at);

      // Add 31 days so the container remains valid for the full
      // 30th calendar day.The lifecycle expires at midnight
      //at the start of the day 31
      expiryDate.setDate(expiryDate.getDate() + 31);

      // Expires at midnight
      expiryDate.setHours(0, 0, 0, 0);
      // Check if the current date is greater than or equal to the expiry date
      timeExpired = new Date() >= expiryDate;
    }

    // Update lifecycle values
    workflowUpdate.use_count = newUseCount;

    // Start the lifecycle timer only once
    if (!container.last_cycle_start_at) {
      // Record the start of the lifecycle by setting the last cycle start date to the current date
      workflowUpdate.last_cycle_start_at = new Date();
    }

    
  
    //check if the container's lifecycle has expired due to usage or time
    if (newUseCount > 14 || timeExpired) {

      //automatically remove expired containers from production
      workflowUpdate.current_status = STAGES.CLEANING;
      // move the container to the cleaning location
      workflowUpdate.location_id = getLocationForStage(STAGES.CLEANING);
      // require supervisor approval before the container can begin a new lifecycle
      workflowUpdate.requires_supervisor_reset = true;
      // Preserve the lifecycle usage count.
      //
      // If the container expires because it exceeded 14 production uses,
      // record the completed lifecycle at 14 uses.
      //
      // If the container expires because the 30-day limit was reached,
      // preserve the actual number of production uses completed.
      workflowUpdate.use_count = newUseCount > 14 ? 14 : container.use_count;
      await containerModel.updateContainerWorkflow(id, workflowUpdate);
      // record the automatic movement to cleaning
      await movementModel.createMovement({
        container_id: container.id,
        from_stage: previousStage,
        to_stage: STAGES.CLEANING,
        moved_by_user_id: user.id,
        approved_by_user_id: null,
      });

      try {
        // request supervisor approval before the container can begin a new lifecycle
        await approvalService.createApproval(
          container,
          STAGES.PRODUCTION,
          STAGES.CLEANING,
          user,
        );
      } catch (err) {
        // prevent duplicate supervisor approval requests
        if (
          err.message ===
          "A pending approval already exists for this container."
        ) {
          return {
            message:
              `Container is already in CLEANING awaiting ${approval.required_role} approval.`,
          };
        }

        throw err;
      }

      return {
        message:
          `Container lifecycle expired. Container moved to CLEANING awaiting ${approval.required_role} approval.`,
      };
    }
  }
  // record movement
  await movementModel.createMovement({
    container_id: container.id,
    from_stage: previousStage,
    to_stage: nextStage,
    moved_by_user_id: user.id,
    approved_by_user_id: approval ? approval.reviewed_by_user_id : null,
  });
  // save the updated lifecycle information
  await containerModel.updateContainerWorkflow(id, workflowUpdate);
   // retrieve the updated container information
  const updatedContainer = await containerModel.getContainerById(id);
// return the movement result
  return {
    message: `Container moved from stage ${previousStage} to ${nextStage}.`,
    container: updatedContainer,
    user,
  };
}

// location map
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
// retrieve a container by its unique code
async function getContainerByCode(code) {

    const container = await containerModel.getContainerByCode(code);

    if (!container) {
        throw new Error("Container not found");
    }

    return container;
}

module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainer,
  moveContainer,
  getContainerByCode,
};
