const request = require("supertest");
const app = require("../app");

const {
  getOperatorToken,
  getQAToken,
  getSupervisorToken
} = require("./helpers/authHelper");

const { createTestContainer } = require("./helpers/containers");

const { move } = require("./helpers/lifecycle");

const {
  requestProduction,
  approveQA,
  rejectQA
} = require("./helpers/approvals");

describe("Container API - Approvals", () => {

  let operatorToken;
  let qaToken;
  let supervisorToken;
  let containerId;

  beforeEach(async () => {
    operatorToken = await getOperatorToken();
    qaToken = await getQAToken();
    supervisorToken = await getSupervisorToken();

    containerId = await createTestContainer(operatorToken);

    await move(containerId, operatorToken, 2);
    await move(containerId, operatorToken, 3);
  });

  test("should create a QA approval request", async () => {
    const response = await requestProduction(containerId, operatorToken);

    expect(response.statusCode).toBe(200);
    expect(response.body.approval).toBeDefined();
  });

  test("QA approval should not start production automatically", async () => {
    const req = await requestProduction(containerId, operatorToken);

    await approveQA(req.body.approval.id, qaToken);

    const container = await request(app)
      .get(`/api/containers/${containerId}`)
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(container.statusCode).toBe(200);
    expect(container.body.current_status).toBe(3);
  });

  test("QA rejection should prevent production", async () => {
    const req = await requestProduction(containerId, operatorToken);

    await rejectQA(req.body.approval.id, qaToken);

    const response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 4 });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("rejected");
  });

  test("should not allow the same QA approval to be approved twice", async () => {
    const req = await requestProduction(containerId, operatorToken);

    await approveQA(req.body.approval.id, qaToken);

    const response = await request(app)
      .put(`/api/approvals/${req.body.approval.id}/review`)
      .set("Authorization", `Bearer ${qaToken}`)
      .send({
        approved: true,
        comments: "Second approval attempt"
      });

    expect(response.statusCode).toBe(400);
  });

});
