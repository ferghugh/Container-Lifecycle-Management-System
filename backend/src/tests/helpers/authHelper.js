// src/tests/helpers/authHelper.js

const request = require("supertest");
const app = require("../../app");

async function getOperatorToken() {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            username: "operator1",
            password: "password123"
        });

    if (response.status !== 200) {
        throw new Error("Unable to authenticate test user.");
    }

    return response.body.token;
}

module.exports = {
    getOperatorToken
};