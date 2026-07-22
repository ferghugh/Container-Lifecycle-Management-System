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

module.exports = {
    getDashboard,
};