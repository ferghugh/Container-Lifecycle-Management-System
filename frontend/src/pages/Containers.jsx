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
import { useNavigate } from "react-router-dom";
import Chip from "@mui/material/Chip";

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

const getUseCountChip = (count) => {
  if (count >= 14) {
    return <Chip label={count} color="error" size="small" />;
  }

  if (count >= 12) {
    return <Chip label={count} color="warning" size="small" />;
  }

  return <Chip label={count} variant="outlined" size="small" />;
};
const Containers = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [containerCode, setContainerCode] = useState("");
  const [createError, setCreateError] = useState("");

  const loadContainers = async () => {
    try {
      const data = await getContainers();

      console.log("Containers:", data);

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
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setContainerCode("");
    setCreateError("");
  };
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

  const filteredContainers = containers.filter((container) => {
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
            onClick={() => setOpenDialog(true)}
          >
            + Create Container
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Containers;
