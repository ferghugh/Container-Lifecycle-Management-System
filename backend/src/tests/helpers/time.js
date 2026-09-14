const pool = require("../../config/database");

// Helper function to simulate the passage of days for a container
async function simulateDaysElapsed(containerId, days) {
  await pool.execute(
    
    `UPDATE containers SET last_cycle_start_at = DATE_SUB(NOW(), INTERVAL ? DAY) WHERE id = ?`,
    [days, containerId]
  );
}

module.exports = { simulateDaysElapsed };
