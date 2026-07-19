const request = require("supertest");
const app = require("../app");

describe("Authentication", () => {

    test("Login with valid credentials returns 200", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "operator1",
                password: "password123"
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

});