const approvalModel = require("../models/approvalModel");
const stageRules = require("../constants/stageRules");

// Create a pending approval request
async function createApproval(container, previousStage, nextStage, user) {

  const action = stageRules.getApprovalAction(
    previousStage,
    nextStage
  );

  console.log("Creating approval:", action);

  const existing = await approvalModel.getPendingApproval(container.id);

  if (existing) {
    throw new Error(
      "A pending approval already exists for this container."
    );
  }

  const approvalId = await approvalModel.createApproval({

    container_id: container.id,

    from_stage: previousStage,

    to_stage: nextStage,

    requested_action: action,

    comments: "Automatically created by workflow.",

    requested_by_user_id: user.id,

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

  // Prevent multiple reviews
  if (approval.status !== "PENDING") {
    throw new Error("Approval has already been reviewed");
  }

  // Determine the new status
  const status = reviewData.approved
    ? "APPROVED"
    : "REJECTED";

  // Update the approval record
  await approvalModel.reviewApproval(id, {
    status,
    reviewed_by_user_id: user.id,
    comments: reviewData.comments,
  });

  // Return the result
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

async function getLatestApproval(containerId,previousStage,  nextStage) {

  const action = stageRules.getApprovalAction(previousStage,nextStage);
  console.log("Looking for approval:", action);

  return await approvalModel.getLatestApproval(
    containerId,
    action
  );
}

module.exports = {
  createApproval,
  reviewApproval,
  getLatestApproval,

};