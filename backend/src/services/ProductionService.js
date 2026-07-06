const containerModel = require("../models/containerModel");
const { STAGES } = require("../constants/stageRules");
const containerService = require("../services/ContainerService");
const movementModel = require("../models/movementModel");
const approvalService = require("./approvalService");
const LOCATIONS = require("../constants/locations");

async function runProductionBatch(containerId) {
const container =
    await containerModel.getContainerById(containerId);

if (!container) {
    throw new Error("Container not found.");
}

if (container.current_status !== STAGES.PRODUCTION) {
    throw new Error("Container is not in Production.");
}

const newUseCount = (container.use_count ?? 0) + 1;

const timeExpired =
  container.last_cycle_start_at &&
  (
    new Date(container.last_cycle_start_at).getTime() +
    (30 * 24 * 60 * 60 * 1000)
  ) < Date.now();
if (newUseCount > 14 || timeExpired) {
console.log(">>> EXPIRY DETECTED <<<");
    // Move container to Cleaning
    await containerModel.updateContainerWorkflow(
        container.id,
     
            
        {
            current_status: STAGES.CLEANING,
            location_id: LOCATIONS.CLEANING,

            is_damaged: container.is_damaged,
            requires_qa_approval: container.requires_qa_approval,
            requires_swab: container.requires_swab,

            use_count: 14,
            last_cycle_start_at: container.last_cycle_start_at,
            initial_qa_approved_at: container.initial_qa_approved_at,
        }
        
    );

            console.log(">>> CONTAINER UPDATED <<<");


    // Record movement
    await movementModel.createMovement({

        container_id: container.id,

        from_stage: STAGES.PRODUCTION,
        to_stage: STAGES.CLEANING,

        moved_by_user_id: 4,
        approved_by_user_id: null,

    });
    console.log(">>> MOVEMENT CREATED <<<");

    // Create Supervisor approval
    await approvalService.createApproval(
        container,
        STAGES.PRODUCTION,
        STAGES.CLEANING,
        {
            id: 4,
            username: "simulation",
            role: "USER"
        }
    );
    console.log(">>> APPROVAL CREATED <<<");

    return {
        message:
            "Container lifecycle expired. Container moved to CLEANING awaiting Supervisor approval."
    };

}
const lastCycleStartAt =
    container.last_cycle_start_at ?? new Date();

const updated = await containerModel.updateProductionUse(
    container.id,
    newUseCount,
    lastCycleStartAt
);

if (!updated) {
    throw new Error("Failed to update production use.");
}
return  await containerModel.getContainerById(container.id);


}
module.exports = {
  runProductionBatch,


};
