const dashboardModel = require("../models/dashboardModel");
// Retrieve dashboard summary metrics
async function getDashboardSummary() {
    return await dashboardModel.getDashboardSummary();
}
// Retrieve analytics data for the dashboard
async function getAnalytics() {
    return await dashboardModel.getAnalytics();
}
// Retrieve regression data for the dashboard
async function getRegressionData() {
    return await dashboardModel.getRegressionData();
}
module.exports = {
    getDashboardSummary,
    getAnalytics,
    getRegressionData,
};
