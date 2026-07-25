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

  // Load the container
  const [containerRows] = await db.query(
    "SELECT * FROM containers WHERE id = ?",
    [id]
  );

  const container = containerRows[0];

  if (!container) {
    return null;
  }

  // Load the movement history
  const [movementRows] = await db.query(
    `SELECT *
     FROM container_movements
     WHERE container_id = ?
     ORDER BY id`,
    [id]
  );

  // Attach movements to the container
  container.movements = movementRows;

  return container;
}

//create a new container in the database with the provided details
async function createContainer(containerData) {
  const {
    container_code,
    current_status,
    location_id,
    requires_qa_approval,
    last_cycle_start_at,
  } = containerData;

  const [result] = await db.query(
    "INSERT INTO containers (container_code, current_status, location_id, requires_qa_approval, last_cycle_start_at, use_count, initial_qa_approved_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      container_code,
      current_status,
      location_id,
      requires_qa_approval,
      last_cycle_start_at,
      0,
      null,
    ],
  );
  return result.insertId;
}

//update existing container details in the database
async function updateContainerWorkflow(id, workflowData) {

  const {
    current_status,
    location_id,
    requires_qa_approval,
    use_count,
    last_cycle_start_at,
    initial_qa_approved_at,
  } = workflowData;

  const [result] = await db.query(
    `UPDATE containers
     SET
        current_status = ?,
        location_id = ?,
        requires_qa_approval = ?,
        last_cycle_start_at = ?,
        use_count = ?,
        initial_qa_approved_at = ?
     WHERE id = ?`,
    [
      current_status,
      location_id,
      requires_qa_approval,
      last_cycle_start_at,
      use_count,
      initial_qa_approved_at,
      id,
    ],
  );

  return result.affectedRows > 0;
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

async function resetLifecycle(containerId) {

    const [result] = await db.query(
        `UPDATE containers
         SET
            use_count = 0,
            last_cycle_start_at = NULL
         WHERE id = ?`,
        [containerId]
    );

    return result.affectedRows > 0;
}

async function updateProductionUse(id, useCount, lastCycleStartAt) {

  const [result] = await db.query(
    `UPDATE containers
     SET
        use_count = ?,
        last_cycle_start_at = ?
     WHERE id = ?`,
    [
      useCount,
      lastCycleStartAt,
      id,
    ]
  );

  return result.affectedRows > 0;
}
async function getContainerByCode(code) {

    const [rows] = await db.query(
        `
        SELECT *
        FROM containers
        WHERE container_code = ?
        `,
        [code]
    );

    return rows[0];
}

// Export the functions for use in other parts of the application
module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainerWorkflow,
  getContainerByCode,
  updateContainer,
  resetLifecycle,
  updateProductionUse,
 
};
