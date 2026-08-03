const dashboardService = require("../services/dashboardService");

// Controller function to handle the request for dashboard summary
async function getDashboard(req, res) {

    try {

        const summary =
            await dashboardService.getDashboardSummary();

        res.status(200).json(summary);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve dashboard."
        });

    }

}
// Controller function to handle the request for analytics data
async function getAnalytics(req, res) {

    try {

        const analytics =
            await dashboardService.getAnalytics();

        res.status(200).json(analytics);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve analytics."
        });

    }

}

module.exports = {
    getDashboard,
    getAnalytics,
};