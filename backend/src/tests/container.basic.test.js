const request = require("supertest");
const app = require("../app");

const { getOperatorToken, getQAToken } = require("./helpers/authHelper");
const { createTestContainer,deleteTestContainer, } = require("./helpers/containers");

// Test suite for basic CRUD operations on containers
describe("Container API - Basic CRUD", () => {
  let operatorToken, qaToken;
// Set up tokens for operator and QA users before running tests
  beforeAll(async () => {
    operatorToken = await getOperatorToken();
    qaToken = await getQAToken();
  });
// Test to retrieve all containers
  test("should return all containers", async () => {
    const response = await request(app)
      .get("/api/containers")
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
// Test to create a new container
 test("should create and update a container", async () => {
  const id = await createTestContainer(qaToken);

  try {
    const response = await request(app)
      .put(`/api/containers/${id}`)
      .set("Authorization", `Bearer ${qaToken}`)
      .send({ container_code: `UPDATED${Date.now()}` });

    expect(response.statusCode).toBe(200);
  } finally {
    await deleteTestContainer(id);
  }
});
});
