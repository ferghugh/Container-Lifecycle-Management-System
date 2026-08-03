import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getContainers, createContainer } from "../services/containerService";
import STATUS from "../constants/status";
import LOCATIONS from "../constants/locations";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chip from "@mui/material/Chip";
// Containers component that fetches and displays a list of containers,
//  allowing users to create new containers and filter/search through existing ones.
const getStatusChip = (status) => {
  const config = {
    Received: { color: "default", variant: "outlined" },
    Cleaning: { color: "warning" },
    "Clean Storage": { color: "info" },
    Production: { color: "success" },
    Retired: { color: "error" },
  };

  return (
    <Chip
      label={status}
      color={config[status]?.color || "default"}
      variant={config[status]?.variant || "filled"}
      size="small"
    />
  );
};
// Function to get a Chip component representing whether QA approval is required
const getQAChip = (value) =>
  value === "Yes" ? (
    <Chip label="Required" color="warning" size="small" />
  ) : (
    <Chip
      label="Not Required"
      color="success"
      variant="outlined"
      size="small"
    />
  );
// Function to get a Chip component representing the use count of a container
const getUseCountChip = (count) => {
  if (count >= 14) {
    return <Chip label={count} color="error" size="small" />;
  }

  if (count >= 12) {
    return <Chip label={count} color="warning" size="small" />;
  }

  return <Chip label={count} variant="outlined" size="small" />;
};
// Containers component that fetches and displays a list of containers,
//  allowing users to create new containers and filter/search through existing ones.
const Containers = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [containerCode, setContainerCode] = useState("");
  const [createError, setCreateError] = useState("");
  const [searchParams] = useSearchParams();
  const dashboardFilter = searchParams.get("filter");

  const loadContainers = async () => {
    try {
      const data = await getContainers();

      console.log("Containers:", data);
      // Format the container data to include human-readable status and location
      const formattedData = data.map((container) => ({
        ...container,
        current_status: STATUS[container.current_status] || "Unknown",
        location_id: LOCATIONS[container.location_id] || "Unknown",
        requires_qa_approval: container.requires_qa_approval ? "Yes" : "No",
      }));

      setContainers(formattedData);
    } catch (error) {
      console.error("Failed to load containers:", error);
    }
  };
  // Function to handle closing the create container dialog and resetting related state
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setContainerCode("");
    setCreateError("");
  };
  // Function to handle creating a new container with the provided container code
  const handleCreateContainer = async () => {
    try {
      setCreateError("");

      await createContainer({
        container_code: containerCode.trim(),
      });

      await loadContainers();

      handleCloseDialog();
    } catch (err) {
      setCreateError(
        err.response?.data?.message || "Failed to create container.",
      );
    }
  };

  useEffect(() => {
    loadContainers();
  }, []);
 // Function to handle closing the create container dialog and resetting related state
  const columns = [
    {
      field: "container_code",
      headerName: "Container",
      flex: 1,
    },
    {
      field: "current_status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "location_id",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "use_count",
      headerName: "Uses",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => getUseCountChip(params.value),
    },
    {
      field: "requires_qa_approval",
      headerName: "QA Required",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => getQAChip(params.value),
    },
  ];
// Filter containers based on the dashboard filter and search term
  const filteredContainers = containers.filter((container) => {
    if (dashboardFilter === "near-expiry") {
      return container.use_count >= 12;
    }

    const search = searchTerm.toLowerCase();

    return (
      container.container_code.toLowerCase().includes(search) ||
      container.current_status.toLowerCase().includes(search) ||
      container.location_id.toLowerCase().includes(search)
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
          }}
        >
          Container Management
        </Typography>

        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Create Container
        </Button>
      </Box>

      {dashboardFilter === "near-expiry" && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#FFF3E0",
            borderLeft: "5px solid #ED6C02",
          }}
        >
          <Typography fontWeight="bold">
            Showing containers approaching lifecycle expiry (12+ production
            uses).
          </Typography>

          <Button size="small" onClick={() => navigate("/containers")}>
            Clear Filter
          </Button>
        </Paper>
      )}
      <TextField
        label="Search by container code, status or location"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Paper elevation={3} sx={{ mt: 2 }}>
        <DataGrid
          rowHeight={55}
          columnHeaderHeight={55}
          rows={filteredContainers}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(params) => navigate(`/containers/${params.row.id}`)}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          disableRowSelectionOnClick
          autoHeight
        />
      </Paper>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Container</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Container Code"
            fullWidth
            value={containerCode}
            onChange={(e) => {
              setContainerCode(e.target.value);
              setCreateError("");
            }}
          />

          {createError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {createError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleCreateContainer}
          >
            Create Container
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Containers;
