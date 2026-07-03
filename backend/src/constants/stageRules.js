// Define the stages of the container lifecycle
const STAGES = {
  RECEIVED: 1,
  CLEANING: 2,
  CLEAN_STORAGE: 3,
  PRODUCTION: 4,
  RETIRED: 5,
};

// Valid stage transitions
const validTransitions = {
  [STAGES.RECEIVED]: [STAGES.CLEANING],
  [STAGES.CLEANING]: [STAGES.CLEAN_STORAGE],
  [STAGES.CLEAN_STORAGE]: [STAGES.PRODUCTION],
  [STAGES.PRODUCTION]: [STAGES.CLEANING, STAGES.RETIRED],
  [STAGES.RETIRED]: [],
};

// Check whether a transition is valid
function isValidTransition(from, to) {
  return validTransitions[from]?.includes(to) || false;
}

// Check whether a transition requires approval
function requiresApproval(from, to) {

  // QA approval BEFORE first production
  if (from === STAGES.CLEAN_STORAGE && to === STAGES.PRODUCTION) {
    return true; // QA approves
  }

  // QA approval BEFORE leaving QA stage (CLEANING → CLEAN_STORAGE)
  if (from === STAGES.CLEANING && to === STAGES.CLEAN_STORAGE) {
    return true; // QA approves
  }

  // Supervisor approval AFTER expiry (PRODUCTION → CLEANING)
  if (from === STAGES.PRODUCTION && to === STAGES.CLEANING) {
    return true; // Supervisor approves
  }

  return false;
}

// Return the approval action name
function getApprovalAction(from, to) {

  if (from === STAGES.CLEAN_STORAGE && to === STAGES.PRODUCTION) {
    return "MoveToProduction";
  }

  if (from === STAGES.CLEANING && to === STAGES.CLEAN_STORAGE) {
    return "QAApproval";
  }

  if (from === STAGES.PRODUCTION && to === STAGES.CLEANING) {
    return "SupervisorApproval";
  }

  return `MoveToStage${to}`;
}

// Return the role that must approve
function getApprovalRole(from, to) {

  if (from === STAGES.CLEAN_STORAGE && to === STAGES.PRODUCTION) {
    return "QA";
  }

  if (from === STAGES.CLEANING && to === STAGES.CLEAN_STORAGE) {
    return "QA";
  }

  if (from === STAGES.PRODUCTION && to === STAGES.CLEANING) {
    return "SUPERVISOR";
  }

  return null;
}

// Determine whether a container has expired
function isExpired(container) {

  // Rule 1: Expired after 14 production uses
  if (container.use_count >= 14) {
    return true;
  }

  // Rule 2: Expired after 30 days in the current lifecycle
  if (!container.last_cycle_start_at) {
    return false;
  }

  const cycleStart = new Date(container.last_cycle_start_at);
  const expiryDate = new Date(cycleStart);
  expiryDate.setDate(expiryDate.getDate() + 30);

  return new Date() > expiryDate;
}

module.exports = {
  STAGES,
  isValidTransition,
  requiresApproval,
  getApprovalAction,
  getApprovalRole,
  isExpired,
};
