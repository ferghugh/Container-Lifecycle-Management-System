// src/models/ContainerModel.js
const db = require("../config/database");

//Retrieve all containers from the database
async function getAllContainers() {
  const [rows] = await db.query(
    "SELECT * FROM containers ORDER BY id, container_code",
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
async function updateContainer(id, containerData) {
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
    "UPDATE containers SET container_code = ?, current_status = ?, location_id = ?, is_damaged = ?, requires_qa_approval = ?, requires_swab = ?, last_cycle_start_at = ? WHERE id = ?",
    [
      container_code,
      current_status,
      location_id,
      is_damaged,
      requires_qa_approval,
      requires_swab,
      last_cycle_start_at,
      id,
    ],
  );
  return result.affectedRows > 0;
}

// Export the functions for use in other parts of the application
module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainer,
 
};
