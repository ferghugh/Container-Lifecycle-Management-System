// src/models/ContainerModel.js
const db = require("../config/database");

//Retrieve all containers from the database
async function getAllContainers() {
  const [rows] = await db.query(
    "SELECT * FROM containers ORDER BY container_code",
  );
  return rows;
}

//retrieve a specific container by its ID from the database
async function getContainerById(id) {
  const [rows] = await db.query("SELECT * FROM containers WHERE id = ?", [id]);
  return rows[0] || null;
}

//create a new container in the database with the provided details
async function createContainer(containerData) {
  const {
    container_code,
    current_status,
    location_id,
    is_damaged,
    requires_qa_approval,
    requires_swab,
    last_cycle_start_at,
  } = containerData;

  const [result] = await db.query(
    "INSERT INTO containers (container_code, current_status, location_id, is_damaged, requires_qa_approval, requires_swab, last_cycle_start_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      container_code,
      current_status,
      location_id,
      is_damaged,
      requires_qa_approval,
      requires_swab,
      last_cycle_start_at,
    ],
  );
  return result.insertId;
}
//update existing container details in the database
async function updateContainerWorkflow(id, workflowData) {
  const {
    current_status,
    location_id,
    is_damaged,
    requires_qa_approval,
    requires_swab,
    last_cycle_start_at,
    initial_qa_approved_at,
  } = workflowData;

  const [result] = await db.query(
    `UPDATE containers
     SET
        current_status = ?,
        location_id = ?,
        is_damaged = ?,
        requires_qa_approval = ?,
        requires_swab = ?,
        last_cycle_start_at = ?,
        initial_qa_approved_at = ?
     WHERE id = ?`,
    [
      current_status,
      location_id,
      is_damaged,
      requires_qa_approval,
      requires_swab,
      last_cycle_start_at,
      initial_qa_approved_at,
      id,
    ],
  );

  return result.affectedRows > 0;
}
//Retrieve a container by its unique code from the database
async function getContainerByCode(containerCode) {
  const [rows] = await db.query(
    "SELECT * FROM containers WHERE container_code = ?",
    [containerCode],
  );
  return rows[0] || null;
}
// Update administrative container details
async function updateContainer(id, containerData) {
  const { container_code } = containerData;

  const [result] = await db.query(
    "UPDATE containers SET container_code = ? WHERE id = ?",
    [container_code, id],
  );

  return result.affectedRows > 0;
}

// Export the functions for use in other parts of the application
module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainerWorkflow,
  getContainerByCode,
  updateContainer,
};
