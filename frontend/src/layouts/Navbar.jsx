import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUsername } from "../utils/auth";
// Navbar component that displays the application title, logged-in username, and a logout button.
function Navbar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Container Lifecycle Management System
                </Typography>

                <Typography sx={{ mr: 3 }}>
                    {getUsername()}
                </Typography>

                <Button
                    color="inherit"
                    onClick={() => navigate("/logout")}
                >
                    Logout
                </Button>

            </Toolbar>
        </AppBar>
    );
}

export default Navbar;