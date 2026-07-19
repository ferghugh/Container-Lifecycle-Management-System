const request = require("supertest");
const app = require("../app");
const { getOperatorToken } = require("./helpers/authHelper");

describe("Container API", () => {
    let token;

    beforeAll(async () => {
        token = await getOperatorToken();
    });

    test("should return all containers", async () => {
        const response = await request(app)
            .get("/api/containers")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("should retrieve a single container", async () => {
        const response = await request(app)
            .get("/api/containers/1") // Change if container ID 1 doesn't exist
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("id");
    });

    test("should return 404 for a non-existent container", async () => {
        const response = await request(app)
            .get("/api/containers/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Container not found");
    });

    test("should reject unauthenticated requests", async () => {
        const response = await request(app)
            .get("/api/containers");

        expect(response.statusCode).toBe(401);
    });
});