const request = require("supertest");
const app = require("../app");
const { getOperatorToken, getQAToken, getSupervisorToken } = require("./helpers/authHelper");
const pool = require("../config/database");



async function firstProductionEntry(
    containerId,
    operatorToken,
    qaToken,
    supervisorToken
) {
    // Request Production
    let response = await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 4 });

    const approvalId = response.body.approval.id;

    // QA approves
    await request(app)
        .put(`/api/approvals/${approvalId}/review`)
        .set("Authorization", `Bearer ${qaToken}`)
        .send({
            approved: true,
            comments: "QA approved"
        });

    // Supervisor moves to Production
    return await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send({ nextStage: 4 });
}

async function completeProductionCycle(
    containerId,
    operatorToken,
    supervisorToken
) {
    // Production -> Cleaning
    await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 2 });

    // Cleaning -> Clean Storage
    await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 3 });

    // Clean Storage -> Production
    return await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send({ nextStage: 4 });
}

// Helper: Create a test container
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

describe("Container API", () => {
  let operatorToken;
  let qaToken;
  let supervisorToken;

  beforeAll(async () => {
    operatorToken = await getOperatorToken();
    qaToken = await getQAToken();
    supervisorToken = await getSupervisorToken();
  });

  test("should return all containers", async () => {
    const response = await request(app)
      .get("/api/containers")
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("should retrieve a single container", async () => {
    const response = await request(app)
      .get("/api/containers/1")
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  test("should return 404 for a non-existent container", async () => {
    const response = await request(app)
      .get("/api/containers/999999")
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Container not found");
  });

  test("should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/containers");
    expect(response.statusCode).toBe(401);
  });

  test("should create a new container", async () => {
    const response = await request(app)
      .post("/api/containers")
      .set("Authorization", `Bearer ${qaToken}`)
      .send({
        container_code: `TEST${Date.now()}`
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Container created successfully.");
    expect(response.body).toHaveProperty("id");
  });

  test("should update a container", async () => {
    const containerId = await createTestContainer(qaToken);

    const response = await request(app)
      .put(`/api/containers/${containerId}`)
      .set("Authorization", `Bearer ${qaToken}`)
      .send({
        container_code: `UPDATED${Date.now()}`
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Container updated successfully.");
  });

  test("should prevent a USER from updating a container", async () => {
    const response = await request(app)
      .put("/api/containers/1")
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({
        container_code: "SHOULDFAIL"
      });

    expect(response.statusCode).toBe(403);
  });

  test("should move a container from RECEIVED to CLEANING", async () => {
    const containerId = await createTestContainer(qaToken);

    const response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 2 });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain("Container moved");
    expect(response.body.container.current_status).toBe(2);
  });

  test("should reject an invalid stage transition", async () => {
    const containerId = await createTestContainer(qaToken);

    const response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 4 });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("Invalid");
  });

  test("should move a container from CLEANING to CLEAN_STORAGE", async () => {
    const containerId = await createTestContainer(qaToken);

    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 2 });

    const response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 3 });

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(3);
  });

  test("should create a QA approval before first move to PRODUCTION", async () => {
    const containerId = await createTestContainer(qaToken);

    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 2 });

    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 3 });

    const response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 4 });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Approval required. Request created.");
    expect(response.body.approval).toBeDefined();
  });

  // Approval Workflow
  describe("Container Production Approval Workflow", () => {
    let containerId;

    beforeEach(async () => {
      operatorToken = await getOperatorToken();
      qaToken = await getQAToken();
      supervisorToken = await getSupervisorToken();

      containerId = await createTestContainer(operatorToken);

      await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 2 });

      await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 3 });
    });

    test("QA approval should not start the production lifecycle", async () => {
      const requestResponse = await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 4 });

      expect(requestResponse.statusCode).toBe(200);
      expect(requestResponse.body.message).toBe("Approval required. Request created.");

      const approvalId = requestResponse.body.approval.id;

      const reviewResponse = await request(app)
        .put(`/api/approvals/${approvalId}/review`)
        .set("Authorization", `Bearer ${qaToken}`)
        .send({
          approved: true,
          comments: "QA approved"
        });

      expect(reviewResponse.statusCode).toBe(200);

      const containerResponse = await request(app)
        .get(`/api/containers/${containerId}`)
        .set("Authorization", `Bearer ${operatorToken}`);

      expect(containerResponse.statusCode).toBe(200);
      expect(containerResponse.body.current_status).toBe(3);
      expect(containerResponse.body.use_count).toBe(0);
      expect(containerResponse.body.last_cycle_start_at).toBeNull();
    });

    test("Supervisor should start the production lifecycle", async () => {
      const requestResponse = await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${operatorToken}`)
        .send({ nextStage: 4 });

      expect(requestResponse.statusCode).toBe(200);

      const approvalId = requestResponse.body.approval.id;

      const reviewResponse = await request(app)
        .put(`/api/approvals/${approvalId}/review`)
        .set("Authorization", `Bearer ${qaToken}`)
        .send({
          approved: true,
          comments: "QA approved"
        });

      expect(reviewResponse.statusCode).toBe(200);

      const productionResponse = await request(app)
        .post(`/api/containers/${containerId}/move`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send({ nextStage: 4 });

      expect(productionResponse.statusCode).toBe(200);
      expect(productionResponse.body.container.current_status).toBe(4);
      expect(productionResponse.body.container.use_count).toBe(1);
      expect(productionResponse.body.container.last_cycle_start_at).not.toBeNull();
      expect(productionResponse.body.container.requires_qa_approval).toBe(0);
    });
    test("should prevent Production after QA rejection", async () => {

  // Request Production
  const requestResponse = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  expect(requestResponse.statusCode).toBe(200);

  const approvalId = requestResponse.body.approval.id;

  // QA rejects
  const rejectionResponse = await request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: false,
      comments: "Container failed inspection"
    });

  expect(rejectionResponse.statusCode).toBe(200);

  // Operator attempts Production again
  const productionResponse = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  expect(productionResponse.statusCode).toBe(400);

  expect(productionResponse.body.message)
    .toContain("rejected");

    

});
test("should increment use_count after a second production cycle", async () => {

  // -----------------------------
  // FIRST ENTRY TO PRODUCTION
  // -----------------------------

  // Request Production
  let response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  const approvalId = response.body.approval.id;

  // QA approves
  await request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: true,
      comments: "QA approved"
    });

  // Supervisor moves to Production
  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);
  expect(response.body.container.use_count).toBe(1);

  // -----------------------------
  // COMPLETE FIRST PRODUCTION CYCLE
  // -----------------------------

  // Production -> Cleaning
  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 2 });

  expect(response.statusCode).toBe(200);

  // Cleaning -> Clean Storage
  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 3 });
    console.log(response.body);

  expect(response.statusCode).toBe(200);

  // -----------------------------
  // SECOND ENTRY TO PRODUCTION
  // -----------------------------

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });
console.log(response.body);
  expect(response.statusCode).toBe(200);

  expect(response.body.container.current_status).toBe(4);
  expect(response.body.container.use_count).toBe(2);


});
test("should increment use_count through 14 production cycles", async () => {

  // -----------------------------
  // FIRST ENTRY TO PRODUCTION
  // -----------------------------

  let response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);

  const approvalId = response.body.approval.id;

  await request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: true,
      comments: "QA approved"
    });

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);
  expect(response.body.container.use_count).toBe(1);

  // -----------------------------
  // COMPLETE REMAINING CYCLES
  // -----------------------------

  for (let expected = 2; expected <= 14; expected++) {

    // Production -> Cleaning
    response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 2 });

    expect(response.statusCode).toBe(200);

    // Cleaning -> Clean Storage
    response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 3 });

    expect(response.statusCode).toBe(200);

    // Clean Storage -> Production
    response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${supervisorToken}`)
      .send({ nextStage: 4 });

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(4);
    expect(response.body.container.use_count).toBe(expected);
  }

});
test("should expire the container on the 15th production cycle", async () => {

  // -----------------------------
  // FIRST ENTRY TO PRODUCTION
  // -----------------------------

  let response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  const approvalId = response.body.approval.id;

  await request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: true,
      comments: "QA approved"
    });

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);
  expect(response.body.container.use_count).toBe(1);

  // -----------------------------
  // COMPLETE CYCLES 2–14
  // -----------------------------

  for (let expected = 2; expected <= 14; expected++) {

    // Production -> Cleaning
    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 2 });

    // Cleaning -> Clean Storage
    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 3 });

    // Clean Storage -> Production
    response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${supervisorToken}`)
      .send({ nextStage: 4 });

    expect(response.statusCode).toBe(200);
    expect(response.body.container.use_count).toBe(expected);
  }

  // -----------------------------
  // ATTEMPT 15th PRODUCTION CYCLE
  // -----------------------------

  // Production -> Cleaning
  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 2 });

  // Cleaning -> Clean Storage
  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 3 });

  // Attempt Production again
  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  console.log(response.body);

  expect(response.statusCode).toBe(200);

  expect(response.body.message)
    .toContain("expired");

 const containerResponse = await request(app)
  .get(`/api/containers/${containerId}`)
  .set("Authorization", `Bearer ${operatorToken}`);

expect(containerResponse.statusCode).toBe(200);

expect(containerResponse.body.current_status).toBe(2); // CLEANING

expect(containerResponse.body.use_count).toBe(14);

});

test("should reset the lifecycle after Supervisor approval", async () => {

  // -----------------------------
  // FIRST ENTRY TO PRODUCTION
  // -----------------------------

  let response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  const qaApprovalId = response.body.approval.id;

  await request(app)
    .put(`/api/approvals/${qaApprovalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: true,
      comments: "QA approved"
    });

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.body.container.use_count).toBe(1);

  // -----------------------------
  // COMPLETE TO 14 USES
  // -----------------------------

  for (let expected = 2; expected <= 14; expected++) {

    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 2 });

    await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({ nextStage: 3 });

    response = await request(app)
      .post(`/api/containers/${containerId}/move`)
      .set("Authorization", `Bearer ${supervisorToken}`)
      .send({ nextStage: 4 });

    expect(response.body.container.use_count).toBe(expected);
  }

  // -----------------------------
  // EXPIRE CONTAINER
  // -----------------------------

  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 2 });

  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 3 });

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.body.message).toContain("expired");

  // -----------------------------
  // FIND SUPERVISOR APPROVAL
  // -----------------------------

 const approvalsResponse = await request(app)
  .get("/api/approvals")
  .set("Authorization", `Bearer ${qaToken}`);

console.log(approvalsResponse.body);

  const supervisorApproval = approvalsResponse.body.find(
    approval =>
      approval.container_id === containerId &&
      approval.status === "PENDING"
  );

  expect(supervisorApproval).toBeDefined();

  // -----------------------------
  // SUPERVISOR APPROVES RESET
  // -----------------------------

  const reviewResponse = await request(app)
    .put(`/api/approvals/${supervisorApproval.id}/review`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({
      approved: true,
      comments: "Reset lifecycle"
    });

  expect(reviewResponse.statusCode).toBe(200);

  // -----------------------------
  // VERIFY RESET
  // -----------------------------

  const containerResponse = await request(app)
    .get(`/api/containers/${containerId}`)
    .set("Authorization", `Bearer ${operatorToken}`);

  expect(containerResponse.body.current_status).toBe(3);
  expect(containerResponse.body.use_count).toBe(0);
  expect(containerResponse.body.last_cycle_start_at).toBeNull();
  expect(containerResponse.body.requires_qa_approval).toBe(0);

  // -----------------------------
  // START NEW LIFECYCLE
  // -----------------------------

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);

  expect(response.body.container.use_count).toBe(1);
  expect(response.body.container.current_status).toBe(4);
  expect(response.body.container.last_cycle_start_at).not.toBeNull();
  expect(response.body.container.requires_qa_approval).toBe(0);

});

test("should expire a container after 30 days", async () => {

  // -----------------------------
  // FIRST ENTRY TO PRODUCTION
  // -----------------------------

  let response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 4 });

  const approvalId = response.body.approval.id;

  await request(app)
    .put(`/api/approvals/${approvalId}/review`)
    .set("Authorization", `Bearer ${qaToken}`)
    .send({
      approved: true,
      comments: "QA approved"
    });

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);
  expect(response.body.container.use_count).toBe(1);

  // -----------------------------
  // SIMULATE 31 DAYS ELAPSING
  // -----------------------------

  await pool.execute(
    `
    UPDATE containers
    SET last_cycle_start_at = DATE_SUB(NOW(), INTERVAL 31 DAY)
    WHERE id = ?
    `,
    [containerId]
  );

  const verify = await request(app)
  .get(`/api/containers/${containerId}`)
  .set("Authorization", `Bearer ${operatorToken}`);

console.log({
  use_count: verify.body.use_count,
  last_cycle_start_at: verify.body.last_cycle_start_at
});

  // -----------------------------
  // NEXT PRODUCTION CYCLE
  // -----------------------------

  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 2 });

  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 3 });

  response = await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${supervisorToken}`)
    .send({ nextStage: 4 });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toContain("expired");

  const containerResponse = await request(app)
    .get(`/api/containers/${containerId}`)
    .set("Authorization", `Bearer ${operatorToken}`);

  expect(containerResponse.statusCode).toBe(200);
  expect(containerResponse.body.current_status).toBe(2);
  expect(containerResponse.body.use_count).toBe(1);
});

  });
  describe("Observation API", () => {

  test("should create a normal observation", async () => {

    const containerId = await createTestContainer(operatorToken);

    const response = await request(app)
      .post("/api/observations")
      .set("Authorization", `Bearer ${operatorToken}`)
      .send({
        container_id: containerId,
        description: "Minor cosmetic scratch",
        is_breach: false
      });

    expect(response.statusCode).toBe(201);

    // Verify the container has NOT moved
    const containerResponse = await request(app)
      .get(`/api/containers/${containerId}`)
      .set("Authorization", `Bearer ${operatorToken}`);

    expect(containerResponse.statusCode).toBe(200);
    expect(containerResponse.body.current_status).toBe(1); // RECEIVED
  });
test("should create a breach observation and move the container to CLEANING", async () => {

  // -----------------------------
  // CREATE CONTAINER
  // -----------------------------

  const containerId = await createTestContainer(operatorToken);

  // Move to CLEANING
  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 2 });

  // Move to CLEAN_STORAGE
  await request(app)
    .post(`/api/containers/${containerId}/move`)
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({ nextStage: 3 });

  // First Production entry
  let response = await firstProductionEntry(
    containerId,
    operatorToken,
    qaToken,
    supervisorToken
  );

  expect(response.statusCode).toBe(200);
  expect(response.body.container.current_status).toBe(4);

  // -----------------------------
  // CREATE BREACH OBSERVATION
  // -----------------------------

  response = await request(app)
    .post("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({
      container_id: containerId,
      description: "Container wall cracked during production",
      is_breach: true
    });

  expect(response.statusCode).toBe(201);

  // -----------------------------
  // VERIFY CONTAINER MOVED
  // -----------------------------

  const containerResponse = await request(app)
    .get(`/api/containers/${containerId}`)
    .set("Authorization", `Bearer ${operatorToken}`);

  expect(containerResponse.statusCode).toBe(200);
  expect(containerResponse.body.current_status).toBe(2); // CLEANING
});
test("should reject unauthenticated observation creation", async () => {

  const containerId = await createTestContainer(operatorToken);

  const response = await request(app)
    .post("/api/observations")
    .send({
      container_id: containerId,
      description: "Unauthenticated observation",
      is_breach: false
    });

  expect(response.statusCode).toBe(401);
});
test("should retrieve all observations", async () => {

  const containerId = await createTestContainer(operatorToken);

  // Create an observation
  await request(app)
    .post("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({
      container_id: containerId,
      description: "Observation retrieval test",
      is_breach: false
    });

  // Retrieve observations
  const response = await request(app)
    .get("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`);

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);

  const observation = response.body.find(
    o =>
      o.container_id === containerId &&
      o.description === "Observation retrieval test"
  );

  expect(observation).toBeDefined();
});
test("QA should resolve an observation", async () => {

  const containerId = await createTestContainer(operatorToken);

  // -----------------------------
  // CREATE OBSERVATION
  // -----------------------------

  await request(app)
    .post("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({
      container_id: containerId,
      description: "Observation to resolve",
      is_breach: false
    });

  // -----------------------------
  // GET OBSERVATIONS
  // -----------------------------

  let response = await request(app)
    .get("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`);

  expect(response.statusCode).toBe(200);

  const observation = response.body.find(
    o =>
      o.container_id === containerId &&
      o.description === "Observation to resolve"
  );

  expect(observation).toBeDefined();

  // -----------------------------
  // QA RESOLVES OBSERVATION
  // -----------------------------

  response = await request(app)
    .put(`/api/observations/${observation.id}/resolve`)
    .set("Authorization", `Bearer ${qaToken}`);

  expect(response.statusCode).toBe(200);
});
test("Supervisor should not be able to resolve an observation", async () => {

  const containerId = await createTestContainer(operatorToken);

  // -----------------------------
  // CREATE OBSERVATION
  // -----------------------------

  await request(app)
    .post("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`)
    .send({
      container_id: containerId,
      description: "Authorization test",
      is_breach: false
    });

  // -----------------------------
  // GET OBSERVATION
  // -----------------------------

  let response = await request(app)
    .get("/api/observations")
    .set("Authorization", `Bearer ${operatorToken}`);

  const observation = response.body.find(
    o =>
      o.container_id === containerId &&
      o.description === "Authorization test"
  );

  expect(observation).toBeDefined();

  // -----------------------------
  // SUPERVISOR ATTEMPTS RESOLUTION
  // -----------------------------

  response = await request(app)
    .put(`/api/observations/${observation.id}/resolve`)
    .set("Authorization", `Bearer ${supervisorToken}`);

  expect(response.statusCode).toBe(403);
});
test("should return an error when resolving a non-existent observation", async () => {

  const response = await request(app)
    .put("/api/observations/999999/resolve")
    .set("Authorization", `Bearer ${qaToken}`);

  expect([400, 404]).toContain(response.statusCode);
});
});

});
