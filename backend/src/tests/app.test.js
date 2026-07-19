const request = require("supertest");
const app = require("../app");

describe("API Health Check", () => {

    test("GET / should return API information", async () => {

        const response = await request(app)
            .get("/");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: " Container Lifecycle Management System API!",
            version: "1.0.0",
            status: "running"
        });

    });

});