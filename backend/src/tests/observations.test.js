const request = require("supertest");
const app = require("../app");

const { getOperatorToken, getQAToken } = require("./helpers/authHelper");
const { createTestContainer } = require("./helpers/containers");
const { move, fullCycle } = require("./helpers/lifecycle");
const { requestProduction, approveQA } = require("./helpers/approvals");

describe("Observation API", () => {
  let operatorToken, qaToken;

  beforeAll(async () => {
    operatorToken = await getOperatorToken();
    qaToken = await getQAToken();
  });

  test("should create a normal observation", async () => {
    const id = await createTestContainer(operatorToken);

    const response = await request(app)
      .post("/api/observations")
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({
        container_id: id,
        description: "Minor scratch",
        is_breach: false
      });

    expect(response.statusCode).toBe(201);
  });

  test("should create a breach observation and move container", async () => {
    const id = await createTestContainer(operatorToken);

    // REQUIRED: move to CLEAN_STORAGE before requesting production
    await move(id, operatorToken, 2); // CLEANING
    await move(id, operatorToken, 3); // CLEAN_STORAGE

    // Request production
    const req = await requestProduction(id, operatorToken);

    // QA approves
    await approveQA(req.body.approval.id, qaToken);

    // Supervisor moves into production
    await fullCycle(id, operatorToken, operatorToken);

    // Create breach observation
    const response = await request(app)
      .post("/api/observations")
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({
        container_id: id,
        description: "Cracked wall",
        is_breach: true
      });

    expect(response.statusCode).toBe(201);

    // Verify container moved to CLEANING
    const container = await request(app)
      .get(`/api/containers/${id}`)
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(container.body.current_status).toBe(2);
  });
});