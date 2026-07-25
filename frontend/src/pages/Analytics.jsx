import { useEffect, useState } from "react";

import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress
} from "@mui/material";

import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut, Bar, Line } from "react-chartjs-2";

import { getAnalytics } from "../services/analyticsService";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Analytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadAnalytics() {

            try {

                const data = await getAnalytics();
                setAnalytics(data);

            } catch (error) {

                console.error("Failed to load analytics:", error);

            } finally {

                setLoading(false);

            }

        }

        loadAnalytics();

    }, []);

    if (loading) {

        return (
            <Box
    sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh"
    }}
>
                <CircularProgress />
            </Box>
        );

    }

const statusChart = {

    labels: analytics.statusDistribution.map(item => item.status),

    datasets: [

        {

            data: analytics.statusDistribution.map(item => item.total),

            backgroundColor: [
                "#42A5F5", // Received
                "#FFA726", // Cleaning
                "#66BB6A", // Clean Storage
                "#5C6BC0", // Production
                "#EF5350"  // Retired
            ],
               borderColor: "#fff",
               borderWidth: 3

        }

    ]

};

 const useChart = {

    labels: analytics.useDistribution.map(item => item.rangeName),

    datasets: [

        {

            label: "Containers",

            data: analytics.useDistribution.map(item => item.total),

            backgroundColor: [
                "#66BB6A",
                "#9CCC65",
                "#FFCA28",
                "#FFA726",
                "#EF5350"
            ]

        }

    ]

};

 const movementChart = {

    labels: analytics.movementTrend.map(item =>
        new Date(item.movementDate).toLocaleDateString("en-IE", {
            day: "2-digit",
            month: "short"
        })
    ),

    datasets: [

        {

            label: "Lifecycle Events",

            data: analytics.movementTrend.map(item => item.total),

            borderColor: "#1976D2",

            backgroundColor: "rgba(25,118,210,0.2)",

            tension: 0.35,

            fill: true

        }

    ]

};
const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {

            position: "top",

        },

    },

};

return (

    <Box sx={{ p: 4 }}>

        <Typography
            variant="h4"
            fontWeight="bold"
        >
            Operational Analytics
        </Typography>

        <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4 }}
        >
            Operational performance and lifecycle insights for production containers.
        </Typography>

        {/* KPI Cards */}

        <Grid container spacing={3}>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: "100%",
                        borderLeft: "6px solid #1976D2",
                        transition: "0.2s",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6
                        }
                    }}
                >

                    <Typography variant="subtitle2" color="text.secondary">
                        Total Lifecycle Events
                    </Typography>

                    <Typography variant="h3" fontWeight="bold">
                        {analytics.kpis.totalLifecycleEvents}
                    </Typography>

                </Paper>

            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: "100%",
                        borderLeft: "6px solid #2E7D32",
                        transition: "0.2s",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6
                        }
                    }}
                >

                    <Typography variant="subtitle2" color="text.secondary">
                        Average Uses
                    </Typography>

                    <Typography variant="h3" fontWeight="bold">
                        {analytics.kpis.averageUses}
                    </Typography>

                </Paper>

            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: "100%",
                        borderLeft: "6px solid #ED6C02",
                        transition: "0.2s",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6
                        }
                    }}
                >

                    <Typography variant="subtitle2" color="text.secondary">
                        Pending Approvals
                    </Typography>

                    <Typography variant="h3" fontWeight="bold">
                        {analytics.kpis.pendingApprovals}
                    </Typography>

                </Paper>

            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: "100%",
                        borderLeft: "6px solid #D32F2F",
                        transition: "0.2s",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6
                        }
                    }}
                >

                    <Typography variant="subtitle2" color="text.secondary">
                        Near Expiry
                    </Typography>

                    <Typography variant="h3" fontWeight="bold">
                        {analytics.kpis.nearExpiry}
                    </Typography>

                </Paper>

            </Grid>

        </Grid>

        {/* Charts */}

        <Grid container spacing={3} sx={{ mt: 2 }}>

            <Grid size={{ xs: 12, md: 6 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: 420
                    }}
                >

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Current Container Status
                    </Typography>

                    <Box sx={{ height: 330 }}>
                        <Doughnut
                            data={statusChart}
                            options={chartOptions}
                        />
                    </Box>

                </Paper>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: 420
                    }}
                >

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Lifecycle Usage Distribution
                    </Typography>

                    <Box sx={{ height: 330 }}>
                        <Bar
                            data={useChart}
                            options={chartOptions}
                        />
                    </Box>

                </Paper>

            </Grid>

        </Grid>

        <Grid container sx={{ mt: 3 }}>

            <Grid size={{ xs: 12 }}>

                <Paper
                    elevation={4}
                    sx={{
                        p: 3,
                        height: 450
                    }}
                >

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Container Movements by Day
                    </Typography>

                    <Box sx={{ height: 360 }}>

                        <Line
                            data={movementChart}
                            options={chartOptions}
                        />

                    </Box>

                </Paper>

            </Grid>

        </Grid>

    </Box>

);
}

export default Analytics;