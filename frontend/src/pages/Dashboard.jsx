import {
  Box,
  Typography,
  Grid,
  Button,
  Stack,
  Paper,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";

import SummaryCard from "../components/SummaryCard";
import { getDashboardSummary } from "../services/dashboardService";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useNavigate } from "react-router-dom";
import { getContainerByCode } from "../services/containerService";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [containerCode, setContainerCode] = useState("");

  const navigate = useNavigate();

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

  const openContainer = async () => {
    if (!containerCode.trim()) return;

    try {
      const container = await getContainerByCode(containerCode);

      navigate(`/containers/${container.id}`);
    } catch (error) {
      alert("Container not found");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Quick Scan */}

      <Paper elevation={4} sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <QrCodeScannerIcon />
          Quick Scan Container
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Scan a barcode or enter a container code to open its details.
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Container Code"
            placeholder="Scan barcode or enter code"
            value={containerCode}
            autoComplete="off"
            onChange={(e) => setContainerCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                openContainer();
              }
            }}
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<QrCodeScannerIcon />}
            sx={{
              minWidth: 180,
              whiteSpace: "nowrap",
            }}
            onClick={openContainer}
          >
            Open Container
          </Button>
        </Stack>
      </Paper>

      {/* Summary Cards */}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard
            title="Total Containers"
            value={summary?.totalContainers ?? 0}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="In Production" value={summary?.production ?? 0} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Cleaning" value={summary?.cleaning ?? 0} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SummaryCard title="Awaiting QA" value={summary?.awaitingQA ?? 0} />
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
