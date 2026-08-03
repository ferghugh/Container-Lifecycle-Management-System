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

const { simulateDaysElapsed } = require("./helpers/time");

describe("Container API - Expiry Rules", () => {

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
// Test to ensure containers expire after 30 days
  test("should expire after 30 days", async () => {
    await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    await simulateDaysElapsed(containerId, 31);

    await move(containerId, operatorToken, 2);
    await move(containerId, operatorToken, 3);

    const response = await move(containerId, supervisorToken, 4);

    expect(response.body.message).toContain("expired");
  });
// Test to ensure containers can be used before 30 days
  test("should allow production before 30 days", async () => {
    await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    await simulateDaysElapsed(containerId, 29);

    const response = await move(containerId, operatorToken, 2);

    expect(response.statusCode).toBe(200);
  });
// Test to ensure containers expire after 14 production uses
  test("should expire after 14 production uses", async () => {
    await firstProductionEntry(
      containerId,
      operatorToken,
      qaToken,
      supervisorToken
    );

    await runCycles(
      containerId,
      operatorToken,
      supervisorToken,
      13
    );

    await move(containerId, operatorToken, 2);
    await move(containerId, operatorToken, 3);

    const response = await move(containerId, supervisorToken, 4);

    expect(response.body.message).toContain("expired");
  });

  
});