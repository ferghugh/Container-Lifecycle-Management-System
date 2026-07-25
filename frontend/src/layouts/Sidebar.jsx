import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 220,
                bgcolor: "#f5f5f5",
                borderRight: 1,
                borderColor: "divider"
            }}
        >

            <List>

                <ListItemButton onClick={() => navigate("/dashboard")}>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/containers")}>
                    <ListItemText primary="Containers" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/approvals")}>
                    <ListItemText primary="Approvals" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/analytics")}>
                    <ListItemText primary="Analytics" />
                </ListItemButton>

            </List>

        </Box>
    );
}

export default Sidebar;