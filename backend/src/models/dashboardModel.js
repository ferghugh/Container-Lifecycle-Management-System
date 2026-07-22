// src/models/dashboardModel.js

const db = require("../config/database");
const { STAGES } = require("../constants/stageRules");

async function getDashboardSummary() {

    const [[total]] = await db.query(
        "SELECT COUNT(*) AS totalContainers FROM containers"
    );

    const [[production]] = await db.query(
        "SELECT COUNT(*) AS production FROM containers WHERE current_status = ?",
        [STAGES.PRODUCTION]
    );

    const [[cleaning]] = await db.query(
        "SELECT COUNT(*) AS cleaning FROM containers WHERE current_status = ?",
        [STAGES.CLEANING]
    );

    const [[awaitingQA]] = await db.query(
        "SELECT COUNT(*) AS awaitingQA FROM containers WHERE requires_qa_approval = TRUE"
    );

    const [[expiringSoon]] = await db.query(
        "SELECT COUNT(*) AS expiringSoon FROM containers WHERE use_count >= 12"
    );

    const [[awaitingSupervisor]] = await db.query(
        `
        SELECT COUNT(*) AS awaitingSupervisor
        FROM approval_requests
        WHERE status='PENDING'
        AND required_role='SUPERVISOR'
        `
    );

    return {
        totalContainers: total.totalContainers,
        production: production.production,
        cleaning: cleaning.cleaning,
        awaitingQA: awaitingQA.awaitingQA,
        awaitingSupervisor: awaitingSupervisor.awaitingSupervisor,
        expiringSoon: expiringSoon.expiringSoon,
    };
}

module.exports = {
    getDashboardSummary,
};