const dashboardModel = require("../models/dashboardModel");

async function getDashboardSummary() {
    return await dashboardModel.getDashboardSummary();
}

async function getAnalytics() {
    return await dashboardModel.getAnalytics();
}

module.exports = {
    getDashboardSummary,
    getAnalytics,
};
