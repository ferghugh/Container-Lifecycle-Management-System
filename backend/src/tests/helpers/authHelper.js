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
        throw new Error("Unable to authenticate operator.");
    }

    return response.body.token;
}

async function getQAToken() {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            username: "qa_user",
            password: "password123"   // assuming this is the QA user's password
        });

    if (response.status !== 200) {
        throw new Error("Unable to authenticate QA user.");
    }

    return response.body.token;
}

//supervisor token can be added here 
async function getSupervisorToken() {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            username: "supervisor1",
            password: "password123"   // assuming this is the supervisor's password
        });

    if (response.status !== 200) {
        throw new Error("Unable to authenticate supervisor.");
    }       

    return response.body.token;
}

module.exports = {
    getOperatorToken,
    getQAToken,
    getSupervisorToken,
};