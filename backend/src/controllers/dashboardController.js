const dashboardService = require("../services/dashboardService");

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