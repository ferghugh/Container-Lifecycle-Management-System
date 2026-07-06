// src/simulation/simulationService.js

const containerModel = require("../models/containerModel");
const containerService = require("../services/containerService");
const { STAGES } = require("../constants/stageRules");
const approvalService = require("../services/approvalService");  
const productionService = require("../services/productionService");

const operatorUser = {
  id: 4,
  username: "simulation_operator",
  role: "USER"
};

const qaUser = {
  id: 1,
  username: "simulation_qa",
  role: "QA"
};

const supervisorUser = {
  id: 2,
  username: "simulation_supervisor",
  role: "SUPERVISOR"
};

// ------------------------------------------------
// Determine the next stage
// ------------------------------------------------

function getNextStage(currentStage) {

  switch (currentStage) {

    case STAGES.RECEIVED:
      return STAGES.CLEANING;

    case STAGES.CLEANING:
      return STAGES.CLEAN_STORAGE;

    case STAGES.CLEAN_STORAGE:
      return STAGES.PRODUCTION;

    // Production containers stay in production.
    // The workflow engine handles expiry and observations.
    case STAGES.PRODUCTION:
      return null;

    default:
      return null;
  }
}
// ------------------------------------------------
// Run one simulation cycle
// ------------------------------------------------
async function runSimulation() {

const pendingApprovals =
  await approvalService.getPendingApprovals();

if (pendingApprovals.length > 0) {

  const approval = pendingApprovals[0];

  const reviewer =
    approval.required_role === "QA"
      ? qaUser
      : supervisorUser;

  const result =
    await approvalService.reviewApproval(
      approval.id,
      {
        approved: true,
        comments: "Automatically approved by simulator."
      },
      reviewer
    );

  return {
    message: "Simulation completed.",
    action: "APPROVE",
    approvalId: approval.id,
    role: reviewer.role,
    result
  };
}


  const containers = await containerModel.getAllContainers();

  if (!containers.length) {
    throw new Error("No containers found.");
  }

  // Only select containers that can make a normal move
const movableContainers = containers.filter(
  container => container.current_status !== STAGES.PRODUCTION
);

if (!movableContainers.length) {

  // All containers are in Production.
  // Simulate one production batch.

  const productionContainers = containers.filter(
    container => container.current_status === STAGES.PRODUCTION
  );

  if (!productionContainers.length) {
    return {
      message: "No containers available for simulation."
    };
  }

  const container = productionContainers.find(
    c => c.container_code === "CNT059"
);
  /*const container =
    productionContainers[
      Math.floor(Math.random() * productionContainers.length)
    ];
    */

const updatedContainer =
    await productionService.runProductionBatch(container.id);

return {
    message: "Production batch completed.",
    action: "PRODUCTION",
    container: updatedContainer.container_code,
    useCount: updatedContainer.use_count,
    result: updatedContainer
};

}

// Pick one movable container

const container =
    productionContainers.find(c => c.id === 37);
    
  const nextStage =
    getNextStage(container.current_status);

  if (!nextStage) {

    return {
      message: "No valid move.",
      container: container.container_code
    };

  }

  // Fake operator
  const simulationUser = {
    id: 4,
    username: "simulation",
    role: "USER"
  };

  const result =
    await containerService.moveContainer(
      container.id,
      { nextStage },
      simulationUser
    );

  return {
    message: "Simulation completed.",
    container: container.container_code,
    from: container.current_status,
    to: nextStage,
    result
  };

}
// ------------------------------------
// Process pending approvals
// ------------------------------------
async function processPendingApprovals() {

  const pendingApprovals =
    await approvalService.getPendingApprovals();

  if (!pendingApprovals.length) {
    return null;
  }

  const approval = pendingApprovals[0];

  const reviewer =
    approval.required_role === "QA"
      ? qaUser
      : supervisorUser;

  const result =
    await approvalService.reviewApproval(
      approval.id,
      {
        approved: true,
        comments: "Automatically approved by simulator."
      },
      reviewer
    );

  return {
    message: "Simulation completed.",
    action: "APPROVE",
    approvalId: approval.id,
    role: reviewer.role,
    result
  };

}
async function runSimulationCycles(cycles) {

  const results = [];

  for (let i = 0; i < cycles; i++) {

    const result = await runSimulation();

    results.push(result);

  }

  return {
    cycles,
    results
  };

}

module.exports = {
  runSimulation,
  processPendingApprovals,
  runSimulationCycles,
};