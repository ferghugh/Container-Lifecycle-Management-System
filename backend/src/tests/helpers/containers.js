const request = require("supertest");
const app = require("../../app");

async function createTestContainer(token) {
  const response = await request(app)
    .post("/api/containers")
    .set("Authorization", `Bearer ${token}`)
    .send({
      container_code: `TEST${Date.now()}${Math.floor(Math.random() * 1000)}`
    });

  expect(response.statusCode).toBe(201);
  return response.body.id;
}

module.exports = { createTestContainer };
