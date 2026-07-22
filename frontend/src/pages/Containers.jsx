import { Box, Typography, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getContainers } from "../services/containerService";
import STATUS from "../constants/status";
import LOCATIONS from "../constants/locations";
import { useNavigate } from "react-router-dom";



const Containers = () => {
 const navigate = useNavigate();
  const [containers, setContainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const loadContainers = async () => {
    try {
      const data = await getContainers();

      const formattedData = data.map((container) => ({
        ...container,
        current_status: STATUS[container.current_status] || "Unknown",
        location_id: LOCATIONS[container.location_id] || "Unknown",
        requires_qa_approval: container.requires_qa_approval ? "Yes" : "No",
        is_damaged: container.is_damaged ? "Yes" : "No",
      }));

      setContainers(formattedData);
    } catch (error) {
      console.error("Failed to load containers:", error);
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
    },
    {
      field: "location_id",
      headerName: "Location",
      flex: 1,
    },
    {
      field: "use_count",
      headerName: "Uses",
      width: 100,
    },
    {
      field: "requires_qa_approval",
      headerName: "QA Required",
      width: 140,
    },
    {
      field: "is_damaged",
      headerName: "Damaged",
      width: 120,
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
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 600,
        }}
      >
        Container Management
      </Typography>
      <TextField
        label="Search Container, Status or Location"
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
    </Box>
  );
};

export default Containers;
