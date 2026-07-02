// This service has a single responsibility:
// Creating approval requests, reviewing approvals
// and retrieving the latest approval.

const approvalModel = require("../models/approvalModel");
const stageRules = require("../constants/stageRules");

// Create a pending approval request
async function createApproval(container, previousStage, nextStage, user) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);

  console.log("Creating approval:", action);

  // Prevent duplicate pending approvals
  const existing = await approvalModel.getPendingApproval(container.id);

  if (existing) {
    throw new Error("A pending approval already exists for this container.");
  }
console.log("Container flags:", {
  requires_qa_approval: container.requires_qa_approval,
  is_damaged: container.is_damaged,
  requires_swab: container.requires_swab,
});
  // Determine who must approve this request
  const requiredRole =
    container.requires_qa_approval ||
    container.is_damaged ||
    container.requires_swab
      ? "QA"
      : "SUPERVISOR";

  // Create the approval request
  const approvalId = await approvalModel.createApproval({
    container_id: container.id,

    from_stage: previousStage,

    to_stage: nextStage,

    requested_action: action,

    required_role: requiredRole,

    comments: "Automatically created by workflow.",

    requested_by_user_id: user.id,
  });

  return approvalId;
}

// Review an approval request
async function reviewApproval(id, reviewData, user) {
  // Retrieve the approval request
  const approval = await approvalModel.getApprovalById(id);
  console.log("Approval:", approval);
  console.log("User:",user)
  console.log(
  `Reviewer role: ${user.role}, Required role: ${approval.required_role}`
);

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

  if (status === "APPROVED") {
    return {
      message: "Approval approved. Container is authorised for movement.",
      approvalId: approval.id,
    };
  }

  return {
    message: "Approval rejected.",
    approvalId: approval.id,
  };
}

// Retrieve the latest approval for a movement
async function getLatestApproval(containerId, previousStage, nextStage) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);

  console.log("Looking for approval:", action);

  return await approvalModel.getLatestApproval(containerId, action);
}

module.exports = {
  createApproval,
  reviewApproval,
  getLatestApproval,
};