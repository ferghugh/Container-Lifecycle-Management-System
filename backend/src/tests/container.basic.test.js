const request = require("supertest");
const app = require("../app");

const { getOperatorToken, getQAToken } = require("./helpers/authHelper");
const { createTestContainer } = require("./helpers/containers");

describe("Container API - Basic CRUD", () => {
  let operatorToken, qaToken;

  beforeAll(async () => {
    operatorToken = await getOperatorToken();
    qaToken = await getQAToken();
  });

  test("should return all containers", async () => {
    const response = await request(app)
      .get("/api/containers")
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should create and update a container", async () => {
    const id = await createTestContainer(qaToken);

    const response = await request(app)
      .put(`/api/containers/${id}`)
      .set("Authorization", `Bearer ${qaToken}`)
      .send({ container_code: `UPDATED${Date.now()}` });

    expect(response.statusCode).toBe(200);
  });
});
