//src/rules/stageRules.js
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
  [STAGES.PRODUCTION]: [
    STAGES.CLEANING,
    STAGES.RETIRED,
  ],
  [STAGES.RETIRED]: [],
};

// Check whether a transition is valid
function isValidTransition(from, to) {
  return validTransitions[from]?.includes(to) || false;
}

// Check whether a transition requires approval
function requiresApproval(from, to) {
  return (
    from === STAGES.CLEAN_STORAGE &&
    to === STAGES.PRODUCTION
  );
}

// Return the approval action name
function getApprovalAction(from, to) {

  if (
    from === STAGES.CLEAN_STORAGE &&
    to === STAGES.PRODUCTION
  ) {
    return "MoveToProduction";
  }

  return `MoveToStage${to}`;
}

// Return the role that must approve
function getApprovalRole(from, to) {

  if (
    from === STAGES.CLEAN_STORAGE &&
    to === STAGES.PRODUCTION
  ) {
    return "QA";
  }

  return null;
}

module.exports = {
  STAGES,
  isValidTransition,
  requiresApproval,
  getApprovalAction,
  getApprovalRole,
};
