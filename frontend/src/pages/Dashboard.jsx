import { Box, Typography, Grid } from "@mui/material";
import SummaryCard from "../components/SummaryCard";
import { useState, useEffect } from "react";
import { getDashboardSummary } from "../services/dashboardService";



const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, []);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

     <Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <SummaryCard
      title="Total Containers"
      value={summary?.totalContainers ?? 0}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <SummaryCard
      title="In Production"
      value={summary?.production ?? 0}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <SummaryCard
      title="Cleaning"
      value={summary?.cleaning ?? 0}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <SummaryCard
      title="Awaiting QA"
      value={summary?.awaitingQA ?? 0}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <SummaryCard
      title="Awaiting Supervisor"
      value={summary?.awaitingSupervisor ?? 0}
    />
  </Grid>

  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <SummaryCard
      title="Expiring Soon"
      value={summary?.expiringSoon ?? 0}
    />
  </Grid>
</Grid>
    </Box>
  );
};

export default Dashboard;
