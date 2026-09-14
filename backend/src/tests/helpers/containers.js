const request = require("supertest");
const app = require("../../app");
const db = require("../../config/database");

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

async function deleteTestContainer(containerId) {
  await db.execute(
    "DELETE FROM approval_requests WHERE container_id = ?",
    [containerId]
  );

  await db.execute(
    "DELETE FROM container_movements WHERE container_id = ?",
    [containerId]
  );

  await db.execute(
    "DELETE FROM containers WHERE id = ?",
    [containerId]
  );
}

module.exports = {
  createTestContainer,
  deleteTestContainer
};