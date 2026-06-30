const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const containerController = require("../controllers/containerController");


// Retrieve all containers
router.get("/", authMiddleware, containerController.getAllContainers);

// Retrieve a single container
router.get("/:id", authMiddleware, containerController.getContainerById);

// Create a new container
router.post(
  "/",
  authMiddleware,
  authorizationMiddleware("QA"),
  containerController.createContainer
);

// Update a container
router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware("QA"),
  containerController.updateContainer
);

//move container to a new location
router.post(
  "/:id/move",
  authMiddleware,
   containerController.moveContainer
);


module.exports = router;