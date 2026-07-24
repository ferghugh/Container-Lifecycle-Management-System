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

async function getApprovalById(id) {

  const [rows] = await db.query(
    "SELECT * FROM approval_requests WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}

async function reviewApproval(id, reviewData) {

  const {
    status,
    reviewed_by_user_id,
    comments,
  } = reviewData;

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
    