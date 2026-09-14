const {
  getOperatorToken,
  getQAToken,
  getSupervisorToken
} = require("./helpers/authHelper");

const { createTestContainer,deleteTestContainer, } = require("./helpers/containers");

const {
  move,
  firstProductionEntry
} = require("./helpers/lifecycle");

describe("Container API - Movement", () => {

  let operatorToken;
  let qaToken;
  let supervisorToken;

  beforeAll(async () => {
    operatorToken = await getOperatorToken();
    qaToken = await getQAToken();
    supervisorToken = await getSupervisorToken();
  });
// Test to move a container through its lifecycle stages
 test("should move container from RECEIVED to CLEANING", async () => {
  const id = await createTestContainer(qaToken);

  try {
    const response = await move(id, operatorToken, 2);

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(2);
  } finally {
    await deleteTestContainer(id);
  }
});

// Test to move a container from CLEANING to CLEAN_STORAGE
  test("should move container from CLEANING to CLEAN_STORAGE", async () => {
  const id = await createTestContainer(qaToken);

  try {
    await move(id, operatorToken, 2);

    const response = await move(id, operatorToken, 3);

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(3);
  } finally {
    await deleteTestContainer(id);
  }
});
// Test to ensure QA approval is required before moving to PRODUCTION
  test("should require QA approval before first Production", async () => {
  const id = await createTestContainer(qaToken);

  try {
    await move(id, operatorToken, 2);
    await move(id, operatorToken, 3);

    const response = await move(id, operatorToken, 4);

    expect(response.statusCode).toBe(200);
    expect(response.body.approval).toBeDefined();
    expect(response.body.message).toMatch(/approval/i);
  } finally {
    await deleteTestContainer(id);
  }
});
// Test to ensure a container can move to PRODUCTION after QA approval
test("should move container to Production after QA approval", async () => {
  const id = await createTestContainer(qaToken);

  try {
    await move(id, operatorToken, 2);
    await move(id, operatorToken, 3);

    const response = await firstProductionEntry(
      id,
      operatorToken,
      qaToken,
      supervisorToken
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(4);
  } finally {
    await deleteTestContainer(id);
  }
});

});