import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContainerById } from "../services/containerService";
import STATUS from "../constants/status";
import LOCATIONS from "../constants/locations";
import { useNavigate } from "react-router-dom";

const ContainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [container, setContainer] = useState(null);

  const loadContainer = async () => {
    try {
      const data = await getContainerById(id);
      setContainer(data);
    } catch (error) {
      console.error("Failed to load container:", error);
    }
  };

  useEffect(() => {
    loadContainer();
  }, [id]);

  if (!container) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Container Details
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View container information and current lifecycle status.
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 900,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Container Code</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{container.container_code}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Status</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Chip
              label={STATUS[container.current_status]}
              color="success"
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Location</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{LOCATIONS[container.location_id]}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Uses</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{container.use_count}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">QA Required</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              {container.requires_qa_approval ? "Yes" : "No"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Supervisor Reset</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              {container.requires_supervisor_reset ? "Yes" : "No"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Swab Required</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{container.requires_swab ? "Yes" : "No"}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Damaged</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{container.is_damaged ? "Yes" : "No"}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Cycle Started</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{formatDate(container.last_cycle_start_at)}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Initial QA Approval</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>
              {formatDate(container.initial_qa_approved_at)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography fontWeight="bold">Created</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography>{formatDate(container.created_at)}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="contained" size="large">
            Move Container
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/containers")}
          >
            Back to Containers
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContainerDetails;
