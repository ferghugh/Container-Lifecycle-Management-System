// src/models/observationModel.js

const db = require("../config/database");

// ------------------------------------
// CREATE OBSERVATION
// ------------------------------------
async function createObservation(observation) {

  const {
    container_id,
    observed_by_user_id,
    description,
    is_breach
  } = observation;

  const [result] = await db.query(
    `INSERT INTO observations
    (
      container_id,
      observed_by_user_id,
      description,
      is_breach,
      status,
      observed_at
    )
    VALUES (?, ?, ?, ?, 'OPEN', NOW())`,
    [
      container_id,
      observed_by_user_id,
      description,
      is_breach
    ]
  );

  return result.insertId;
}

// ------------------------------------
// GET ALL OBSERVATIONS
// ------------------------------------
async function getAllObservations(status = null) {

  let sql = `
    SELECT o.*,
           c.container_code,
           u.username AS observed_by
    FROM observations o
    JOIN containers c
      ON o.container_id = c.id
    JOIN users u
      ON o.observed_by_user_id = u.id
  `;

  const params = [];

  if (status) {
    sql += ` WHERE o.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY o.observed_at DESC`;

  const [rows] = await db.query(sql, params);

  return rows;
}

// ------------------------------------
// GET OBSERVATION
// ------------------------------------
async function getObservationById(id) {

  const [rows] = await db.query(
    `SELECT *
     FROM observations
     WHERE id = ?`,
    [id]
  );

  return rows[0];
}

// ------------------------------------
// RESOLVE OBSERVATION
// ------------------------------------
async function resolveObservation(id, userId) {

  const [result] = await db.query(
    `UPDATE observations
     SET
       status = 'RESOLVED',
       resolved_by_user_id = ?,
       resolved_at = NOW()
     WHERE id = ?`,
    [
      userId,
      id
    ]
  );

  return result.affectedRows > 0;
}

module.exports = {
  createObservation,
  getAllObservations,
  getObservationById,
  resolveObservation,
};