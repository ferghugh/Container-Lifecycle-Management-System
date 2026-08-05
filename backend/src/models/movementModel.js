//src/models/movementModel.js


const db = require("../config/database");

// Record a container movement
async function createMovement(movementData) {
// Destructure the movement data to extract relevant fields
  const {
    container_id,
    from_stage,
    to_stage,
    moved_by_user_id,
    approved_by_user_id,
  } = movementData;
// Insert the movement record into the database
  const [result] = await db.query(
    `INSERT INTO container_movements
    (
      container_id,
      from_stage,
      to_stage,
      moved_at,
      moved_by_user_id,
      approved_by_user_id
    )
    VALUES (?, ?, ?, NOW(), ?, ?)`,
    [
      container_id,
      from_stage,
      to_stage,
      moved_by_user_id,
      approved_by_user_id,
    ]
  );

  return result.insertId;
}

// Retrieve all movements for a container
async function getMovementsByContainer(containerId) {
// Query to fetch all movements for a specific container, ordered by the movement timestamp in descending order
  const [rows] = await db.query(
    `SELECT *
     FROM container_movements
     WHERE container_id = ?
     ORDER BY moved_at DESC`,
    [containerId]
  );

  return rows;
}

module.exports = {
  createMovement,
  getMovementsByContainer,
};