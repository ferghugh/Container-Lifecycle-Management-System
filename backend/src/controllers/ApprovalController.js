// src/controllers/ApprovalController.js

// add the endpoints for posting approval and the put for review

const approvalService = require("../services/approvalService");

// Create a new approval request
async function createApproval(req, res) {
  try {
    const approval = await approvalService.createApproval(
      req.body,
      req.user
    );

    res.status(201).json({
      message: "Approval request created.",
      approval,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

// Review an approval request
async function reviewApproval(req, res) {
  try {
    const result = await approvalService.reviewApproval(
      req.params.id,
      req.body,
      req.user
    );

    res.json({
      message: "Approval reviewed successfully.",
      result,
    });

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}
// Retrieve all pending approvals
async function getPendingApprovals(req, res) {

  try {

    const approvals =
      await approvalService.getPendingApprovals();

    res.json(approvals);

  }
  catch(error){

    res.status(500).json({
      message: error.message
    });

  }

}

module.exports = {
  createApproval,
  reviewApproval,
  getPendingApprovals,
};