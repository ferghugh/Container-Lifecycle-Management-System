import { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { getContainerByCode } from "../services/containerService";
// QuickScan component that allows users to scan a QR code or barcode 
// to quickly access container details.
const QuickScan = () => {
  const navigate = useNavigate();
// useEffect hook to initialize the QR code scanner when the component mounts
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );
    // Render the scanner and handle the decoded text to navigate to the container details page
    scanner.render(
      // Callback function that handles the decoded text from the QR code or barcode
      async (decodedText) => {
        try {
          console.log("Decoded:", decodedText);
         // Fetch the container details using the decoded text (container code)
          const container = await getContainerByCode(decodedText.trim());
          // Clear the scanner after a successful scan to prevent multiple scans
          await scanner.clear();
          // Navigate to the container details page using the container ID
          navigate(`/containers/${container.id}`);
        } catch (error) {
          console.error("Container lookup failed:", error);
          alert("Container not found. Please scan again");
        }
      },
      () => {
        // Ignore continuous scan errors
      },
    );
  // Cleanup function to clear the scanner when the component unmounts
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [navigate]);
// Render the QuickScan component UI, including instructions and the scanner area
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Scan Container
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Point your phone camera at a QR code or barcode.
      </Typography>

      <Paper sx={{ p: 2 }}>
        <div id="reader"></div>
      </Paper>
    </Box>
  );
};

export default QuickScan;
