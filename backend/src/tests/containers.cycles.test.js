const {
  getOperatorToken,
  getQAToken,
  getSupervisorToken
} = require("./helpers/authHelper");

const { createTestContainer } = require("./helpers/containers");

const {
  move,
  firstProductionEntry,
  runCycles
} = require("./helpers/lifecycle");

describe("Container API - Production Cycles", () => {

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

  test("should set use_count to 1 on first Production entry", async () => {
    const response = await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.container.use_count).toBe(1);
  });

  test("should increment use_count after one additional production cycle", async () => {
    await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    const response = await runCycles(
      containerId,
      operatorToken,
      supervisorToken,
      1
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.container.use_count).toBe(2);
  });

  test("should increment use_count through production cycles", async () => {
    await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    const final = await runCycles(
      containerId,
      operatorToken,
      supervisorToken,
      13
    );

    expect(final.statusCode).toBe(200);
    expect(final.body.container.use_count).toBe(14);
  });

  test("should keep the container in Production after valid cycles", async () => {
    await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    const final = await runCycles(
      containerId,
      operatorToken,
      supervisorToken,
      5
    );

    expect(final.statusCode).toBe(200);
    expect(final.body.container.current_status).toBe(4);
  });

});