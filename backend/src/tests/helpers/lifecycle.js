const request = require("supertest");
const app = require("../../app");

async function move(containerId, token, nextStage) {
  return request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${token}`)
    .send({ nextStage });
}

// ------------------------------------
// FIRST PRODUCTION ENTRY
// ------------------------------------
async function firstProductionEntry(
  containerId,
  operatorToken,
  qaToken,
  supervisorToken
) {
  // Request Production
  let response = await move(containerId, operatorToken, 4);

  const approvalId = response.body.approval.id;

  // QA approves
  await request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: true,
      comments: "QA approved"
    });

  // Supervisor performs the move
  return move(containerId, supervisorToken, 4);
}

async function fullCycle(containerId, operatorToken, supervisorToken) {
  await move(containerId, operatorToken, 2);
  await move(containerId, operatorToken, 3);

  return move(containerId, supervisorToken, 4);
}

async function runCycles(containerId, operatorToken, supervisorToken, count) {
  let response;

  for (let i = 0; i < count; i++) {
    response = await fullCycle(containerId, operatorToken, supervisorToken);
  }

  return response;
}

module.exports = {
  move,
  firstProductionEntry,
  fullCycle,
  runCycles
};

