// This service has a single responsibility:
// Creating approval requests, reviewing approvals
// and retrieving the latest approval.

const approvalModel = require("../models/approvalModel");
const stageRules = require("../constants/stageRules");

// Create a pending approval request
async function createApproval(container, previousStage, nextStage, user) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);



  // Prevent duplicate pending approvals
  const existing = await approvalModel.getPendingApproval(container.id);

  if (existing) {
    throw new Error("A pending approval already exists for this container.");
  }

  
let requiredRole;

if (container.requires_qa_approval) {

    requiredRole = "QA";

}
else if (container.use_count >= 14) {

    requiredRole = "SUPERVISOR";

}
else {

    throw new Error("Approval is not required.");

}

  const approvalId = await approvalModel.createApproval({
    
    container_id: container.id,

    from_stage: previousStage,

    to_stage: nextStage,

    requested_action: action,

    required_role: requiredRole,

    comments: "Automatically created by workflow.",

    requested_by_user_id: user.id,
    
  });
console.log({
  containerId: container.id,
  initialQaApprovedAt: container.initial_qa_approved_at,
  requiredRole
});
  return approvalId;
}

// Review an approval request
async function reviewApproval(id, reviewData, user) {
  // Retrieve the approval request
  const approval = await approvalModel.getApprovalById(id);

  if (!approval) {
    throw new Error("Approval request not found");
  }

  // Ensure the correct role is reviewing
  if (user.role !== approval.required_role) {
    throw new Error(`Approval must be performed by ${approval.required_role}.`);
  }

  // Prevent multiple reviews
  if (approval.status !== "PENDING") {
    throw new Error("Approval has already been reviewed");
  }

  // Determine the new status
  const status = reviewData.approved ? "APPROVED" : "REJECTED";

  // Update the approval
  await approvalModel.reviewApproval(id, {
    status,
    reviewed_by_user_id: user.id,
    comments: reviewData.comments,
  });
  
// start new lifecyycle
if (
  status === "APPROVED" &&
  approval.required_role === "SUPERVISOR"
) {
// Reset the container's lifecycle
  const container = await containerModel.getContainerById(
    approval.container_id
  );
// Update the container's workflow to reset its lifecycle
  await containerModel.updateContainerWorkflow(
    approval.container_id,
    {
      current_status: container.current_status,
      location_id: container.location_id,
      requires_qa_approval: false,
      last_cycle_start_at: null,
      use_count: 0,
      initial_qa_approved_at: container.initial_qa_approved_at,
    }
  );
}
// Return the result of the review
  if (status === "APPROVED") {
    return {
      message: "Approval approved. Container is authorised for movement.",
      approvalId: approval.id,
    };
  }
// Return the result of the review if rejected
  return {
    message: "Approval rejected.",
    approvalId: approval.id,
  };
}

// Retrieve the latest approval for a movement
async function getLatestApproval(containerId, previousStage, nextStage) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);

  return await approvalModel.getLatestApproval(containerId, action);
}

module.exports = {
  createApproval,
  reviewApproval,
  getLatestApproval,
};