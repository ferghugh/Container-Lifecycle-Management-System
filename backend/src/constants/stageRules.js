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

function requiresApproval(from, to) {
  // Initial QA approval before first Production entry
  if (from === STAGES.CLEAN_STORAGE && to === STAGES.PRODUCTION) {
    return true;
  }

  return false;
}
// Get the approval action based on the transition
function getApprovalAction(from, to) {
  if (from === STAGES.CLEAN_STORAGE && to === STAGES.PRODUCTION) {
    return "QAApproval";
  }

  if (from === STAGES.PRODUCTION && to === STAGES.CLEANING) {
    return "SupervisorApproval";
  }

  return `MoveToStage${to}`;
}
// Get the approval role based on the transition
function getApprovalRole(from, to) {

  // Initial QA approval before first Production entry
  if (
    from === STAGES.CLEAN_STORAGE &&
    to === STAGES.PRODUCTION
  ) {
    return "QA";
  }

  // Supervisor approval for moving from Production to Cleaning
  if (
    from === STAGES.PRODUCTION &&
    to === STAGES.CLEANING
  ) {
    return "SUPERVISOR";
  }

  return null;
}
// Check if a container is expired based on its use count and last cycle start date
function isExpired(container) {
  // Rule 1: Expired after 14 production uses
  if (container.use_count > 14) {
    return true;
  }

  // Rule 2: Expired after 30 days in the current lifecycle
  if (!container.last_cycle_start_at) {
    return false;
  }
  // Calculate the expiry date based on the last cycle start date
  const cycleStart = new Date(container.last_cycle_start_at);

  const expiryDate = new Date(cycleStart);
  //Allow the full 30th calendar day
  expiryDate.setDate(expiryDate.getDate() + 31);
  //Expire at midnight at the start of the 31st day
  expiryDate.setHours(0, 0, 0, 0);
  // Check if the current date is greater than or equal to the expiry date
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
