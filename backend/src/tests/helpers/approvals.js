const request = require("supertest");
const app = require("../../app");

async function requestProduction(containerId, operatorToken) {
  return request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });
}

async function approveQA(approvalId, qaToken) {
  return request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({ approved: true, comments: "QA approved" });
}

async function rejectQA(approvalId, qaToken) {
  return request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({ approved: false, comments: "QA rejected" });
}

async function approveSupervisor(approvalId, supervisorToken) {
  return request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ approved: true, comments: "Supervisor approved" });
}

module.exports = {
  requestProduction,
  approveQA,
  rejectQA,
  approveSupervisor
};
