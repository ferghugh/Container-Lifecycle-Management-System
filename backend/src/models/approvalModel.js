//src/models/ApprovalModel.js
const db = require("../config/database");


//create a new approval request

async function createApproval(approvalData) {

    const{
        container_id,
        from_stage,
        to_stage,
        requested_action,
        required_role,
        comments,
        requested_by_user_id,

    } = approvalData;

// Insert the new approval request into the database
    const [result] = await db.query(
    `INSERT INTO approval_requests
    (
      container_id,
      from_stage,
      to_stage,
      requested_action,
      required_role,
      comments,
      requested_by_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      container_id,
      from_stage,
      to_stage,
      requested_action,
      required_role,
      comments,
      requested_by_user_id,
    ]
  );

  return result.insertId;
}
// Retrieve all pending approval requests
async function getPendingApproval(containerId) {

  const [rows] = await db.query(
    `SELECT *
     FROM approval_requests
     WHERE container_id = ?
     AND status = 'PENDING'`,
    [containerId]
  );

  return rows[0] || null;
}
// Retrieve an approval request by its ID
async function getApprovalById(id) {

  const [rows] = await db.query(
    "SELECT * FROM approval_requests WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}
// Update the status of an approval request
async function reviewApproval(id, reviewData) {
// Destructure the review data to extract status, reviewer ID, and comments
  const {
    status,
    reviewed_by_user_id,
    comments,
  } = reviewData;
// Update the approval request in the database with the new status, reviewer ID, and comments
  const [result] = await db.query(
    `UPDATE approval_requests
     SET
        status = ?,
        reviewed_by_user_id = ?,
        reviewed_at = NOW(),
        comments = ?
     WHERE id = ?`,
    [
      status,
      reviewed_by_user_id,
      comments,
      id,
    ]
  );

  return result.affectedRows > 0;
}
// Retrieve the latest approval for a container movement
async function getLatestApproval(containerId, requestedAction) {
// Query to fetch the latest approval request for a specific container and action, 
// ordered by the request timestamp in descending order
  const [rows] = await db.query(
    `SELECT *
     FROM approval_requests
     WHERE container_id = ?
     AND requested_action = ?
     ORDER BY requested_at DESC
     LIMIT 1`,
    [containerId, requestedAction]
  );

  return rows[0] || null;
}
// Retrieve all pending approval requests
async function getPendingApprovals() {
// Query to fetch all pending approval requests along with their associated container codes
  const [rows] = await db.query(`
    SELECT
      ar.*,
      c.container_code
    FROM approval_requests ar
    INNER JOIN containers c
      ON ar.container_id = c.id
    WHERE ar.status = 'PENDING'
    ORDER BY ar.requested_at ASC
  `);

  return rows;
}

module.exports = {
  createApproval,
  getPendingApproval,
  getApprovalById,
  reviewApproval,
  getLatestApproval,
  getPendingApprovals
};
    