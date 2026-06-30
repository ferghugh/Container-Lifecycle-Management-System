const approvalModel = require("../models/approvalModel");
const stageRules = require("../constants/stageRules");
const movementModel = require("../models/movementModel");
const containerModel = require("../models/containerModel");



// Create a pending approval request
async function createApproval(container, previousStage, nextStage, user) {
    
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

    requested_action: stageRules.getApprovalAction(
      previousStage,
      nextStage
    ),

    comments: "Automatically created by workflow.",

    requested_by_user_id: user.id,

  });

  return approvalId;
}

async function reviewApproval(id, reviewData, user) {

  const approval = await approvalModel.getApprovalById(id);

  if (!approval) {
    throw new Error("Approval request not found");
  }

  if (approval.status !== "PENDING") {
    throw new Error("Approval has already been reviewed");
  }

  const status = reviewData.approved
    ? "APPROVED"
    : "REJECTED";

  await approvalModel.reviewApproval(id, {
    status,
    reviewed_by_user_id: user.id,
    comments: reviewData.comments,
  });

  if (status === "REJECTED") {
    return {
      message: "Approval rejected."
    };
  }

  //Retrieve the container
  const container = await containerModel.getContainerById(
  approval.container_id
);

if (!container) {
  throw new Error("Container not found");
}

await movementModel.createMovement({

  container_id: approval.container_id,

  from_stage: approval.from_stage,

  to_stage: approval.to_stage,

  moved_by_user_id: approval.requested_by_user_id,

  approved_by_user_id: user.id,

});
await containerModel.updateContainerWorkflow(
  approval.container_id,
  {
    current_status: approval.to_stage,

    location_id: approval.to_stage, // we'll replace this with getLocationForStage()

    is_damaged: container.is_damaged,

    requires_qa_approval: false,

    requires_swab: container.requires_swab,

    last_cycle_start_at:
      approval.to_stage === stageRules.STAGES.PRODUCTION
        ? new Date()
        : container.last_cycle_start_at,

    initial_qa_approved_at:
      approval.to_stage === stageRules.STAGES.PRODUCTION
        ? new Date()
        : container.initial_qa_approved_at,
  }
);
const updatedContainer =
  await containerModel.getContainerById(
    approval.container_id
  );

return {
  message: "Approval completed.",
  approvalId: approval.id,
  container: updatedContainer,
};

}
module.exports = {
  createApproval,
  reviewApproval,

};