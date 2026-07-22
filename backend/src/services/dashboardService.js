const dashboardModel = require("../models/dashboardModel");

async function getDashboardSummary() {
    return await dashboardModel.getDashboardSummary();
}

module.exports = {
    getDashboardSummary,
};
