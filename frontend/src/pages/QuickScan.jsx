import { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { getContainerByCode } from "../services/containerService";
// QuickScan component that allows users to scan a QR code or barcode 
// to quickly access container details.
const QuickScan = () => {
  const navigate = useNavigate();

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
      async (decodedText) => {
        try {
          console.log("Decoded:", decodedText);

          const container = await getContainerByCode(decodedText.trim());

          await scanner.clear();

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

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [navigate]);

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
