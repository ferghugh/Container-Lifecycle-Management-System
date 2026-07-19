// src/controllers/ContainerController.js

const containerService = require("../services/containerService");

// Retrieve all containers
async function getAllContainers(req, res) {
  try {
    const containers = await containerService.getAllContainers();
    res.status(200).json(containers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve containers." });
  }
}

// Retrieve a container by ID
async function getContainerById(req, res) {
  try {
    const { id } = req.params;

    const container = await containerService.getContainerById(id);

    res.status(200).json(container);

  } catch (error) {

    if (error.message === "Container not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve container.",
    });
  }
}

// Create a new container
async function createContainer(req, res) {
  try {
    const containerId = await containerService.createContainer(req.body);

    res.status(201).json({
      message: "Container created successfully.",
      id: containerId,
    });
  } catch (error) {
    if (
      error.message === "Container code is required" ||
      error.message === "Container code already exists"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to create container.",
    });
  }
}

//update an existing container
async function updateContainer(req, res) {
  try {
    const { id } = req.params;

    await containerService.updateContainer(id, req.body);

    res.status(200).json({
      message: "Container updated successfully.",
    });
  } catch (error) {
    if (error.message === "Container not found") {
      return res.status(404).json({
        message: error.message,
      });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to update container." });
  }
}


//move container through the lifecycle stages and update its location
async function moveContainer(req, res) {
  try {
    const result = await containerService.moveContainer(
      req.params.id,
      req.body,
      req.user,
    );

    res.json(result);

  } catch (error) {

    // Expected business rule / validation errors
    if (
      error.message.includes("Invalid stage transition") ||
      error.message.includes("Approval") ||
      error.message.includes("nextStage") ||
      error.message.includes("Container not found")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to move container.",
    });
  }
}


module.exports = {
  getAllContainers,
  getContainerById,
  createContainer,
  updateContainer,
  moveContainer,
};
