import { Card, CardContent, Typography } from "@mui/material";

const SummaryCard = ({ title, value }) => {
  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          minHeight: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          sx={{
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </Typography>

        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
