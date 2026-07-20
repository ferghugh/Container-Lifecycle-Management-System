const request = require("supertest");
const app = require("../../app");

// Generic login helper
async function login(username, password = "password123") {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ username, password });

  if (response.status !== 200) {
    throw new Error(`Unable to authenticate user: ${username}`);
  }

  return response.body.token;
}

// Role-specific helpers
async function getOperatorToken() {
  return login("operator1");
}

async function getQAToken() {
  return login("qa_user");
}

async function getSupervisorToken() {
  return login("supervisor1");
}

module.exports = {
  getOperatorToken,
  getQAToken,
  getSupervisorToken,
};
