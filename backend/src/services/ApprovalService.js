// This service has a single responsibility:
// Creating approval requests, reviewing approvals
// and retrieving the latest approval.

const approvalModel = require("../models/approvalModel");
const containerModel = require("../models/containerModel");
const movementModel = require("../models/movementModel");

const LOCATIONS = require("../constants/locations");
const stageRules = require("../constants/stageRules");
const { STAGES } = require("../constants/stageRules");

// Create a pending approval request
async function createApproval(container, previousStage, nextStage, user) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);
// Prevent duplicate pending approvals
  const existing = await approvalModel.getPendingApproval(container.id);
  if (existing) {
    throw new Error("A pending approval already exists for this container.");
  }
// Determine the required role for the approval based on the container's state and the transition
  const requiredRole = stageRules.getApprovalRole(previousStage, nextStage);

  const approvalId = await approvalModel.createApproval({
    container_id: container.id,
    from_stage: previousStage,
    to_stage: nextStage,
    requested_action: action,
    required_role: requiredRole,
    comments: "Automatically created by workflow.",
    requested_by_user_id: user.id,
  });

  return await approvalModel.getApprovalById(approvalId);
}
// Review an approval request
async function reviewApproval(id, reviewData, user) {
// Retrieve the approval request by its ID
  const approval = await approvalModel.getApprovalById(id);

  if (!approval) {
    throw new Error("Approval request not found");
  }

  if (user.role !== approval.required_role) {
    throw new Error(`Approval must be performed by ${approval.required_role}.`);
  }

  if (approval.status !== "PENDING") {
    throw new Error("Approval has already been reviewed");
  }
// Determine the new status based on the review data
  const status = reviewData.approved ? "APPROVED" : "REJECTED";

  await approvalModel.reviewApproval(id, {
    status,
    reviewed_by_user_id: user.id,
    comments: reviewData.comments,
  });

 
  // stop here if rejected
  
  if (status === "REJECTED") {

    return {
      message: "Approval rejected.",
      approvalId: approval.id,
    };

  }

  // supervisor reset after expiry
   if (
    approval.requested_action === "SupervisorApproval" ||
    approval.requested_action === "SupervisorExpiryReset"
  ) {

    try {
    const container = await containerModel.getContainerById(
      approval.container_id
    );

    await containerModel.updateContainerWorkflow(
      approval.container_id,
      {
        current_status: STAGES.CLEAN_STORAGE,
        location_id: LOCATIONS.CLEAN_STORAGE,

        
        requires_qa_approval: false,
        requires_supervisor_reset: false,
  

        use_count: 0,
        last_cycle_start_at: null,
        initial_qa_approved_at: container.initial_qa_approved_at,
      }
    );
// Log the movement of the container back to Clean Storage
    await movementModel.createMovement({
      container_id: approval.container_id,
      from_stage: STAGES.CLEANING,
      to_stage: STAGES.CLEAN_STORAGE,
      moved_by_user_id: user.id,
      approved_by_user_id: user.id,
    });
   } catch (error) {
      throw new Error("Error resetting container lifecycle: " + error.message);
      throw error;
    }

    return {
      message:
        "Supervisor approved. Container returned to Clean Storage and lifecycle reset.",
      approvalId: approval.id,
    };
  }
  // all other approvals
    return {
    message: "Approval approved. Container is authorised for movement.",
    approvalId: approval.id,
  };

}
// Retrieve the latest approval for a movement
async function getLatestApproval(containerId, previousStage, nextStage) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);
  return await approvalModel.getLatestApproval(containerId, action);
}
// Retrieve the latest approval by requested action
async function getLatestApprovalByAction(containerId, action) {
  return await approvalModel.getLatestApproval(containerId, action);
}
// Retrieve all pending approvals
async function getPendingApprovals() {
  return await approvalModel.getPendingApprovals();
}

module.exports = {
  createApproval,
  reviewApproval,
  getLatestApproval,
  getPendingApprovals,
  getLatestApprovalByAction,
};