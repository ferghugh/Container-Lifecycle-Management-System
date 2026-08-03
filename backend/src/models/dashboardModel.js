// src/models/dashboardModel.js

const db = require("../config/database");
const { STAGES } = require("../constants/stageRules");
// Retrieve dashboard summary metrics
async function getDashboardSummary() {
  //
  const [[total]] = await db.query(
    "SELECT COUNT(*) AS totalContainers FROM containers",
  );
  // Retrieve counts for each stage and other relevant metrics
  const [[production]] = await db.query(
    "SELECT COUNT(*) AS production FROM containers WHERE current_status = ?",
    [STAGES.PRODUCTION],
  );
  // Retrieve counts for cleaning, awaiting QA, expiring soon, and awaiting supervisor approval
  const [[cleaning]] = await db.query(
    "SELECT COUNT(*) AS cleaning FROM containers WHERE current_status = ?",
    [STAGES.CLEANING],
  );

  const [[awaitingQA]] = await db.query(
    "SELECT COUNT(*) AS awaitingQA FROM containers WHERE requires_qa_approval = TRUE",
  );

  const [[expiringSoon]] = await db.query(
    "SELECT COUNT(*) AS expiringSoon FROM containers WHERE use_count >= 12 AND use_count < 14",
  );

  const [[awaitingSupervisor]] = await db.query(
    `
        SELECT COUNT(*) AS awaitingSupervisor
        FROM approval_requests
        WHERE status='PENDING'
        AND required_role='SUPERVISOR'
        `,
  );
  // Return the summary metrics as an object
  return {
    totalContainers: total.totalContainers,
    production: production.production,
    cleaning: cleaning.cleaning,
    awaitingQA: awaitingQA.awaitingQA,
    awaitingSupervisor: awaitingSupervisor.awaitingSupervisor,
    expiringSoon: expiringSoon.expiringSoon,
  };
}
// Retrieve analytics data for the dashboard
async function getAnalytics() {
  const [kpiEvents] = await db.query(`
        SELECT COUNT(*) AS totalLifecycleEvents
        FROM container_movements
    `);

  const [kpiAverageUses] = await db.query(`
        SELECT ROUND(AVG(use_count), 2) AS averageUses
        FROM containers
    `);

  const [kpiPendingApprovals] = await db.query(`
        SELECT COUNT(*) AS pendingApprovals
        FROM approval_requests
        WHERE status = 'PENDING'
    `);

  const [kpiNearExpiry] = await db.query(`
        SELECT COUNT(*) AS nearExpiry
        FROM containers
        WHERE use_count BETWEEN 12 AND 13
    `);
// Retrieve the distribution of containers based on their current status
  const [statusDistribution] = await db.query(`
        SELECT
    CASE current_status
    WHEN 1 THEN 'Received'
    WHEN 2 THEN 'Cleaning'
    WHEN 3 THEN 'Clean Storage'
    WHEN 4 THEN 'Production'
    WHEN 5 THEN 'Retired'
     END AS status,
     COUNT(*) AS total
     FROM containers
     GROUP BY current_status
     ORDER BY current_status;
    `);
// Retrieve the distribution of containers based on their use count
  const [useDistribution] = await db.query(`
        SELECT
CASE
    WHEN use_count BETWEEN 0 AND 3 THEN '0-3'
    WHEN use_count BETWEEN 4 AND 7 THEN '4-7'
    WHEN use_count BETWEEN 8 AND 11 THEN '8-11'
    WHEN use_count BETWEEN 12 AND 13 THEN '12-13'
    ELSE '14'
END AS rangeName,

COUNT(*) AS total

FROM containers

GROUP BY rangeName

ORDER BY
FIELD(rangeName,'0-3','4-7','8-11','12-13','14');
    `);
// Retrieve the trend of container movements over time
  const [movementTrend] = await db.query(`
        SELECT
            DATE(moved_at) AS movementDate,
            COUNT(*) AS total
        FROM container_movements
        GROUP BY DATE(moved_at)
        ORDER BY movementDate
    `);
// Return the analytics data as an object
  return {
    kpis: {
      totalLifecycleEvents: kpiEvents[0].totalLifecycleEvents,

      averageUses: kpiAverageUses[0].averageUses,

      pendingApprovals: kpiPendingApprovals[0].pendingApprovals,

      nearExpiry: kpiNearExpiry[0].nearExpiry,
    },

    statusDistribution,

    useDistribution,

    movementTrend,
  };
}

module.exports = {
  getDashboardSummary,
  getAnalytics,
};
