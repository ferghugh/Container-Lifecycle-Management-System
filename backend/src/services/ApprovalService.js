// This service has a single responsibility:
// Creating approval requests, reviewing approvals
// and retrieving the latest approval.

const approvalModel = require("../models/approvalModel");
const stageRules = require("../constants/stageRules");

async function createApproval(container, previousStage, nextStage, user) {
  const action = stageRules.getApprovalAction(previousStage, nextStage);

  const existing = await approvalModel.getPendingApproval(container.id);
  if (existing) {
    throw new Error("A pending approval already exists for this container.");
  }

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

  return approvalId;
}

// Review an approval request
async function reviewApproval(id, reviewData, user) {
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

  const status = reviewData.approved ? "APPROVED" : "REJECTED";

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
  return await approvalModel.getLatestApproval(containerId, action);
}

module.exports = {
  createApproval,
  reviewApproval,
  getLatestApproval,
};
