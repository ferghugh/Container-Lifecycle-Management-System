import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1 }}>
                <Navbar />

                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default MainLayout;