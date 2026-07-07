// src/simulation/simulationService.js

const containerModel = require("../models/containerModel");
const containerService = require("../services/containerService");
const approvalService = require("../services/approvalService");
const productionService = require("../services/productionService");

const { STAGES } = require("../constants/stageRules");

// ------------------------------------------------
// Simulation Users
// ------------------------------------------------

const simulationUser = {
  id: 4,
  username: "simulation",
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
// Determine next workflow stage
// ------------------------------------------------

function getNextStage(currentStage) {

  switch (currentStage) {

    case STAGES.RECEIVED:
      return STAGES.CLEANING;

    case STAGES.CLEANING:
      return STAGES.CLEAN_STORAGE;

    case STAGES.CLEAN_STORAGE:
      return STAGES.PRODUCTION;

    case STAGES.PRODUCTION:
    default:
      return null;

  }

}

// ------------------------------------------------
// Process pending approvals
// ------------------------------------------------

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

// ------------------------------------------------
// Run one simulation cycle
// ------------------------------------------------

async function runSimulation() {

  // Process approvals first
  const approvalResult =
    await processPendingApprovals();

  if (approvalResult) {
    return approvalResult;
  }

  const containers =
    await containerModel.getAllContainers();

  if (!containers.length) {
    throw new Error("No containers found.");
  }

  // Containers waiting to move
  const movableContainers =
    containers.filter(
      container =>
        container.current_status !== STAGES.PRODUCTION
    );

  // ------------------------------------
  // All containers are in Production
  // ------------------------------------

  if (!movableContainers.length) {

    const productionContainers =
      containers.filter(
        container =>
          container.current_status === STAGES.PRODUCTION
      );

    if (!productionContainers.length) {

      return {
        message: "No containers available for simulation."
      };

    }

    const container =
      productionContainers[
        Math.floor(
          Math.random() * productionContainers.length
        )
      ];

    const result =
      await productionService.runProductionBatch(
        container.id
      );

    return {
      message: "Production batch completed.",
      action: "PRODUCTION",
      result
    };

  }

  // ------------------------------------
  // Move a waiting container
  // ------------------------------------

  const container =
    movableContainers[
      Math.floor(
        Math.random() * movableContainers.length
      )
    ];

  const nextStage =
    getNextStage(container.current_status);

  if (!nextStage) {

    return {
      message: "No valid move.",
      container: container.container_code
    };

  }

  const result =
    await containerService.moveContainer(
      container.id,
      { nextStage },
      simulationUser
    );

  return {

    message: "Simulation completed.",

    action: "MOVE",

    container: container.container_code,

    from: container.current_status,

    to: nextStage,

    result

  };

}

// ------------------------------------------------
// Run multiple simulation cycles
// ------------------------------------------------

async function runSimulationCycles(cycles) {

  const results = [];

  for (let i = 0; i < cycles; i++) {

    const result =
      await runSimulation();

    results.push(result);

  }

  return {

    cycles,

    results

  };

}

module.exports = {

  runSimulation,

  runSimulationCycles,

  processPendingApprovals

};