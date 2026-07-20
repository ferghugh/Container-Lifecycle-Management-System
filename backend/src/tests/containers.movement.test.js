const {
  getOperatorToken,
  getQAToken,
  getSupervisorToken
} = require("./helpers/authHelper");

const { createTestContainer } = require("./helpers/containers");

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

  test("should move container from RECEIVED to CLEANING", async () => {
    const id = await createTestContainer(qaToken);

    const response = await move(id, operatorToken, 2);

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(2);
  });

  test("should move container from CLEANING to CLEAN_STORAGE", async () => {
    const id = await createTestContainer(qaToken);

    await move(id, operatorToken, 2);

    const response = await move(id, operatorToken, 3);

    expect(response.statusCode).toBe(200);
    expect(response.body.container.current_status).toBe(3);
  });

  test("should require QA approval before first Production", async () => {
    const id = await createTestContainer(qaToken);

    await move(id, operatorToken, 2);
    await move(id, operatorToken, 3);

    const response = await move(id, operatorToken, 4);

    expect(response.statusCode).toBe(200);
    expect(response.body.approval).toBeDefined();
    expect(response.body.message).toMatch(/approval/i);
  });

  test("should move container to Production after QA approval", async () => {
    const id = await createTestContainer(qaToken);

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
  });

});