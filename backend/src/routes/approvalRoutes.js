// src/routes/approvalRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const approvalController = require("../controllers/approvalController");

// QA can see pending approvals
router.get(
  "/",
  authMiddleware,
  authorizationMiddleware("QA","SUPERVISOR"),
  approvalController.getPendingApprovals
);

// QA reviews an approval
router.put(
  "/:id/review",
  authMiddleware,
  approvalController.reviewApproval
);

module.exports = router;