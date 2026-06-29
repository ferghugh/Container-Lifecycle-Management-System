// src/services/ContainerService.js

const containerModel = require("../models/ContainerModel");

// Retrieve all containers
async function getAllContainers() {
  return await containerModel.getAllContainers();
}

// Retrieve a container by ID
async function getContainerById(id) {
  const container = await containerModel.getContainerById(id);

  if (!container) {
    throw new Error("Container not found");
  }

  return container;
}

// Create a new container
async function createContainer(containerData) {
  return await containerModel.createContainer(containerData);
}

// Update an existing container
async function updateContainer(id, containerData) {
  const exists = await containerModel.getContainerById(id);

  if (!exists) {
    throw new Error("Container not found");
  }

  return await containerModel.updateContainer(id, containerData);
}

module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainer,

};